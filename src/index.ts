/// <reference path="../@types/index.d.ts" />

import { Queue } from './Queue';
import util  = require('util')

const noOp: Function = () => {};

export function dialect (name: string): FxOrmSqlDDLSync__Dialect.Dialect {
	return require("./Dialects/" + name);
}

export class Sync implements FxOrmSqlDDLSync.Sync {
	constructor (
		options: FxOrmSqlDDLSync.SyncOptions,
		private debug = (options.debug || noOp) as Function,
		private driver: FxOrmSqlDDLSync__Driver.Driver = options.driver,
		private Dialect: FxOrmSqlDDLSync__Dialect.Dialect = require("./Dialects/" + driver.dialect),
		private suppressColumnDrop = options.suppressColumnDrop,
		private collections = [],
		private types       = {},
		private total_changes: number
	) {
	}

	private processCollection (
		collection: FxOrmSqlDDLSync__Collection.Collection, cb: FxOrmSqlDDLSync.ExecutionCallback<boolean>
	) {
		this.Dialect.hasCollection(this.driver, collection.name, (err, has) => {
			if (err)
				return cb(err);

			if (!has)
				return this.createCollection(collection, (err) => {
					if (err) return cb(err);
					return cb(null, true);
				});
			else
				return cb(null, false);

			// I have concerns about the data integrity of the automatic sync process.
			// There has been lots of bugs and issues associated with it.
			// Dialect.getCollectionProperties(driver, collection.name, function (err, columns) {
			// 	if (err) {
			// 		return cb(err);
			// 	}

			// 	return syncCollection(collection, columns, cb);
			// });
		});
	};

	private createCollection (
		collection: FxOrmSqlDDLSync__Collection.Collection,
		cb: FxOrmSqlDDLSync.ExecutionCallback<any>
	) {
		var columns = [];
		var keys = [];
		var before  = [];

		var nextBefore = () => {
			if (before.length === 0) {
				return this.Dialect.createCollection(this.driver, collection.name, columns, keys, (err) => {
					if (err) return cb(err);
					return this.syncIndexes(collection.name, this.getCollectionIndexes(collection), cb);
				});
			}

			var next = before.shift();

			next(this.driver, (err) => {
				if (err) {
					return cb(err);
				}

				return nextBefore();
			});
		};

		for (var k in collection.properties) {
			var prop, col;

			prop = collection.properties[k];
			prop.mapsTo = prop.mapsTo || k;

			col = this.createColumn(collection.name, prop);

			if (col === false) {
				return cb(new Error("Unknown type for property '" + k + "'"));
			}

			if (prop.key) {
				keys.push(prop.mapsTo);
			}

			columns.push(col.value);

			if (col.before) {
				before.push(col.before);
			}
		}

		this.debug("Creating " + collection.name);

		if (typeof this.Dialect.processKeys == "function") {
			keys = this.Dialect.processKeys(keys);
		}

		this.total_changes += 1;

		return nextBefore();
	};


	private createColumn (
		collection: FxOrmSqlDDLSync.TableName,
		prop: FxOrmSqlDDLSync__Column.Property
	): false | FxOrmSqlDDLSync__Column.OpResult__CreateColumn {
		var type: false | string | FxOrmSqlDDLSync__Column.OpResult__CreateColumn;

		if (this.types.hasOwnProperty(prop.type)) {
			type = this.types[prop.type].datastoreType(prop);
		} else {
			type = this.Dialect.getType(collection, prop, this.driver);
		}

		if (type === false)
			return false;
			
		if (typeof type == "string") {
			type = <FxOrmSqlDDLSync__Column.OpResult__CreateColumn>{ value : type };
		}

		if (prop.mapsTo === undefined) {
			console.log("undefined prop.mapsTo", prop, (new Error()).stack)
		}

		return {
			value  : this.driver.query.escapeId(prop.mapsTo) + " " + type.value,
			before : type.before
		};
	};

	private syncCollection (collection, columns, cb) {

		var queue   = new Queue(cb);
		var last_k  = null;

		this.debug("Synchronizing " + collection.name);

		for (var k in collection.properties) {
			if (!columns.hasOwnProperty(k)) {
				var col = this.createColumn(collection.name, collection.properties[k]);

				if (col === false) {
					return cb(new Error("Unknown type for property '" + k + "'"));
				}

				this.debug("Adding column " + collection.name + "." + k + ": " + col.value);

				this.total_changes += 1;

				if (col.before) {
					queue.add(col, (col: FxOrmSqlDDLSync__Column.OpResult__CreateColumn, next) => {
						col.before(this.driver, (err: Error) => {
							if (err) {
								return next(err);
							}
							return this.Dialect.addCollectionColumn(this.driver, collection.name, col.value, last_k, next);
						});
					});
				} else {
					queue.add((next) => {
						return this.Dialect.addCollectionColumn(this.driver, collection.name, (col as FxOrmSqlDDLSync__Column.OpResult__CreateColumn).value, last_k, next);
					});
				}
			} else if (this.needToSync(collection.properties[k], columns[k])) {
				// var col = createColumn(collection.name, k/* collection.properties[k] */);
				var col = this.createColumn(collection.name, collection.properties[k]);

				if (col === false) {
					return cb(new Error("Unknown type for property '" + k + "'"));
				}

				this.debug("Modifying column " + collection.name + "." + k + ": " + col.value);

				this.total_changes += 1;

				if (col.before) {
					queue.add(col, (col: FxOrmSqlDDLSync__Column.OpResult__CreateColumn, next) => {
						col.before(this.driver, (err) => {
							if (err) {
								return next(err);
							}
							return this.Dialect.modifyCollectionColumn(this.driver, collection.name, col.value, next);
						});
					});
				} else {
					queue.add((next) => {
						return this.Dialect.modifyCollectionColumn(this.driver, collection.name, (col as FxOrmSqlDDLSync__Column.OpResult__CreateColumn).value, next);
					});
				}
			}

			last_k = k;
		}

        if ( !this.suppressColumnDrop ) {
            for (var k in columns) {
                if (!collection.properties.hasOwnProperty(k)) {
                    queue.add((next: FxOrmSqlDDLSync.ExecutionCallback<any>) => {
                        this.debug("Dropping column " + collection.name + "." + k);

                        this.total_changes += 1;

                        return this.Dialect.dropCollectionColumn(this.driver, collection.name, k, next);
                    });
                }
            }
        }

		var indexes = this.getCollectionIndexes(collection);

		if (indexes.length) {
			queue.add((next: FxOrmSqlDDLSync.ExecutionCallback<any>) => {
				return this.syncIndexes(collection.name, indexes, next);
			});
		}

		return queue.check();
	};

	private getIndexName (
		collection: FxOrmSqlDDLSync__Collection.Collection, prop: FxOrmSqlDDLSync__Column.Property
	) {
		var post = prop.unique ? 'unique' : 'index';

		if (this.driver.dialect == 'sqlite') {
			return collection.name + '_' + prop.name + '_' + post;
		} else {
			return prop.name + '_' + post;
		}
	};

	private getCollectionIndexes (
		collection: FxOrmSqlDDLSync__Collection.Collection
	): FxOrmSqlDDLSync__DbIndex.DbIndexInfo[] {
		let indexes: FxOrmSqlDDLSync__DbIndex.DbIndexInfo[] = [];
		let found: boolean,
			prop: FxOrmSqlDDLSync__Column.Property;

		for (let k in collection.properties) {
			prop = collection.properties[k];

			if (prop.unique) {
				let mixed_arr_unique: (string | true)[] = prop.unique as string[]
				if (!Array.isArray(prop.unique)) {
					mixed_arr_unique = [ prop.unique ];
				}

				for (let i = 0; i < mixed_arr_unique.length; i++) {
					if (mixed_arr_unique[i] === true) {
						indexes.push({
							name    : this.getIndexName(collection, prop),
							unique  : true,
							columns : [ k ]
						});
					} else {
						found = false;

						for (let j = 0; j < indexes.length; j++) {
							if (indexes[j].name == mixed_arr_unique[i]) {
								found = true;
								indexes[j].columns.push(k);
								break;
							}
						}

						if (!found) {
							indexes.push({
								name    : mixed_arr_unique[i] as string,
								unique  : true,
								columns : [ k ]
							});
						}
					}
				}
			}
			
			if (prop.index) {
				let mixed_arr_index: (string | true)[] = prop.index as string[]
				if (!Array.isArray(prop.index)) {
					mixed_arr_index = [ prop.index ];
				}

				for (var i = 0; i < mixed_arr_index.length; i++) {
					if (mixed_arr_index[i] === true) {
						indexes.push({
							name    : this.getIndexName(collection, prop),
							columns : [ k ]
						});
					} else {
						found = false;

						for (var j = 0; j < indexes.length; j++) {
							if (indexes[j].name == mixed_arr_index[i]) {
								found = true;
								indexes[j].columns.push(k);
								break;
							}
						}
						if (!found) {
							indexes.push({
								name    : mixed_arr_index[i] as string,
								columns : [ k ]
							});
						}
					}
				}
			}
		}

		if (typeof this.Dialect.convertIndexes == "function") {
			indexes = this.Dialect.convertIndexes(collection, indexes);
		}

		return indexes;
	};

	private syncIndexes (
		name: string, indexes: FxOrmSqlDDLSync__DbIndex.DbIndexInfo[], cb: FxOrmSqlDDLSync.ExecutionCallback<any>
	) {
		if (indexes.length == 0) return cb(null);

		this.Dialect.getCollectionIndexes(this.driver, name, (err: Error, db_indexes) => {
			if (err) return cb(err);

			var queue = new Queue(cb);

			for (let i = 0; i < indexes.length; i++) {
				if (!db_indexes.hasOwnProperty(indexes[i].name)) {
					this.debug("Adding index " + name + "." + indexes[i].name + " (" + indexes[i].columns.join(", ") + ")");

					this.total_changes += 1;

					queue.add(indexes[i], (index, next) => {
						return this.Dialect.addIndex(this.driver, index.name, index.unique, name, index.columns, next);
					});
					continue;
				} else if (!db_indexes[indexes[i].name].unique != !indexes[i].unique) {
					this.debug("Replacing index " + name + "." + indexes[i].name);

					this.total_changes += 1;

					queue.add(indexes[i], (index, next) => {
						return this.Dialect.removeIndex(this.driver, index.name, name, next);
					});
					queue.add(indexes[i], (index, next) => {
						return this.Dialect.addIndex(this.driver, index.name, index.unique, name, index.columns, next);
					});
				}
				delete db_indexes[indexes[i].name];
			}

			for (let idx in db_indexes) {
				this.debug("Removing index " + name + "." + idx);

				this.total_changes += 1;

				queue.add(idx, (index, next) => {
					return this.Dialect.removeIndex(this.driver, index, name, next);
				});
			}

			return queue.check();
		});
	};

	private needToSync (
		property: FxOrmSqlDDLSync__Column.Property,
		column: FxOrmSqlDDLSync__Column.ColumnInfo
	): boolean {
		if (property.serial && property.type == "number") {
			property.type = "serial";
		}
		if (property.type != column.type) {
			if (typeof this.Dialect.supportsType != "function") {
				return true;
			}
			if (this.Dialect.supportsType(property.type) != column.type) {
				return true;
			}
		}
		if (property.type == "serial") {
			return false; // serial columns have a fixed form, nothing more to check
		}
		if (property.required != column.required && !property.key) {
			return true;
		}
		if (property.hasOwnProperty("defaultValue") && property.defaultValue != column.defaultValue) {
			return true;
		}
		if (property.type == "number" || property.type == "integer") {
			if (column.hasOwnProperty("size") && (property.size || 4) != column.size) {
				return true;
			}
		}
		if (property.type == "enum" && column.type == "enum") {
			if (util.difference(property.values, column.values).length > 0
			|| util.difference(column.values, property.values).length > 0) {
				return true;
			}
		}

		return false;
	};
	
	defineCollection (collection: FxOrmSqlDDLSync__Collection.Collection, properties: FxOrmSqlDDLSync__Collection.Collection['properties']): FxOrmSqlDDLSync.Sync {
		this.collections.push({
			name       : collection,
			properties : properties
		});
		return this;
	}
	defineType (type: string, proto: FxOrmSqlDDLSync__Driver.CustomPropertyType): FxOrmSqlDDLSync.Sync {
		this.types[type] = proto;
		return this;
	}
	sync (cb?: FxOrmSqlDDLSync.ExecutionCallback<FxOrmSqlDDLSync.SyncResult>): void {
		var i = 0;
		var processNext = () => {
			if (i >= this.collections.length) {
				return cb(null, {
					changes: this.total_changes
				});
			}

			var collection = this.collections[i++];

			this.processCollection(collection, (err: Error) => {
				if (err) {
					return cb(err);
				}

				return processNext();
			});
		};

		this.total_changes = 0;

		return processNext();
	}
}