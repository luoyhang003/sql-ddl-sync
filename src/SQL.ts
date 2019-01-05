/// <reference path="../@types/index.d.ts" />

export function CREATE_TABLE (options: FxOrmSqlDDLSync__SQL.TableOptions, driver: FxOrmSqlDDLSync__Driver.Driver) {
	var sql = "CREATE TABLE " + driver.query.escapeId(options.name) + " (" + options.columns.join(", ");

	if (options.keys && options.keys.length > 0) {
		sql += ", PRIMARY KEY (" + options.keys.map(function (val) {
			return driver.query.escapeId(val);
		}).join(", ") + ")";
	}

	sql += ")";

	return sql;
};

export function DROP_TABLE (options: FxOrmSqlDDLSync__SQL.TableOptions, driver: FxOrmSqlDDLSync__Driver.Driver) {
	var sql = "DROP TABLE " + driver.query.escapeId(options.name);

	return sql;
};

export function ALTER_TABLE_ADD_COLUMN (options: FxOrmSqlDDLSync__SQL.AddColumnOptions, driver: FxOrmSqlDDLSync__Driver.Driver) {
	var sql = "ALTER TABLE " + driver.query.escapeId(options.name) +
	          " ADD " + options.column;

	if (options.after) {
		sql += " AFTER " + driver.query.escapeId(options.after);
	} else if (options.first) {
		sql += " FIRST";
	}

	return sql;
};

export function ALTER_TABLE_RENAME_COLUMN (opts: FxOrmSqlDDLSync__SQL.AlertColumnRenameOptions, driver: FxOrmSqlDDLSync__Driver.Driver) {
	var eid = driver.query.escapeId;
	var sql = "ALTER TABLE "	+ eid(opts.name) +
	          " RENAME COLUMN " + eid(opts.oldColName) + " TO " + eid(opts.newColName);

  return sql;
}

export function ALTER_TABLE_MODIFY_COLUMN (options: FxOrmSqlDDLSync__SQL.AlertColumnOptions, driver: FxOrmSqlDDLSync__Driver.Driver) {
	var sql = "ALTER TABLE " + driver.query.escapeId(options.name) +
	          " MODIFY " + options.column;

	return sql;
};

export function ALTER_TABLE_DROP_COLUMN (options: FxOrmSqlDDLSync__SQL.AlertColumnOptions, driver: FxOrmSqlDDLSync__Driver.Driver) {
	var sql = "ALTER TABLE " + driver.query.escapeId(options.name) +
	          " DROP " + driver.query.escapeId(options.column);

	return sql;
};

export function CREATE_INDEX (options: FxOrmSqlDDLSync__SQL.IndexOptions, driver: FxOrmSqlDDLSync__Driver.Driver) {
	var sql = "CREATE" + (options.unique ? " UNIQUE" : "") + " INDEX " + driver.query.escapeId(options.name) +
	          " ON " + driver.query.escapeId(options.collection) +
	          " (" + options.columns.map(function (col) { return driver.query.escapeId(col); }) + ")";

	return sql;
};

export function DROP_INDEX (options: FxOrmSqlDDLSync__SQL.IndexOptions, driver: FxOrmSqlDDLSync__Driver.Driver) {
	var sql = "DROP INDEX " + driver.query.escapeId(options.name) +
	          " ON " + driver.query.escapeId(options.collection);

	return sql;
};

// export function RENAME_TABLE (options, driver: FxOrmSqlDDLSync__Driver.Driver) {
//  var sql = "ALTER TABLE " + options.oldCollectionName + " RENAME TO " + options.newCollectionName + " ;";
// }
