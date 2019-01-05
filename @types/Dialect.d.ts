/// <reference types="fibjs" />
/// <reference path="_common.d.ts" />

declare namespace FxOrmSqlDDLSync__Dialect {
    interface Dialect {
        hasCollection: {
            (driver: FxOrmSqlDDLSync__Driver.Driver, name: string, cb: FxOrmSqlDDLSync.ExecutionCallback<boolean>)
        }
        addPrimaryKey: {
            (driver: FxOrmSqlDDLSync__Driver.Driver, tableName: string, columnName: string, cb: FxOrmSqlDDLSync.ExecutionCallback<any>)
        }
        dropPrimaryKey: {
            (driver: FxOrmSqlDDLSync__Driver.Driver, tableName: string, columnName: string, cb: FxOrmSqlDDLSync.ExecutionCallback<any>)
        }
        addForeignKey: {
            (driver: FxOrmSqlDDLSync__Driver.Driver, tableName: string, options, cb: FxOrmSqlDDLSync.ExecutionCallback<any>)
        }
        dropForeignKey: {
            (driver: FxOrmSqlDDLSync__Driver.Driver, tableName: string, columnName: string, cb: FxOrmSqlDDLSync.ExecutionCallback<any>)
        }
        getCollectionProperties: {
            (driver: FxOrmSqlDDLSync__Driver.Driver, name: string, cb: FxOrmSqlDDLSync.ExecutionCallback<any>)
        }
        createCollection: {
            (driver: FxOrmSqlDDLSync__Driver.Driver, name: string, columns: string[], keys: string[], cb: FxOrmSqlDDLSync.ExecutionCallback<any>)
        }
        dropCollection: {
            (driver: FxOrmSqlDDLSync__Driver.Driver, name: string, cb: FxOrmSqlDDLSync.ExecutionCallback<any>)
        }
        addCollectionColumn: {
            (driver: FxOrmSqlDDLSync__Driver.Driver, name: string, column: string, after_column: string|false, cb: FxOrmSqlDDLSync.ExecutionCallback<any>)
        }
        renameCollectionColumn: {
            (driver: FxOrmSqlDDLSync__Driver.Driver, name: string, oldColName: string, newColName: string, cb: FxOrmSqlDDLSync.ExecutionCallback<any>)
        }
        modifyCollectionColumn: {
            (driver: FxOrmSqlDDLSync__Driver.Driver, name: string, column: string, cb: FxOrmSqlDDLSync.ExecutionCallback<any>)
        }
        dropCollectionColumn: {
            (driver: FxOrmSqlDDLSync__Driver.Driver, name: string, column: string, cb: FxOrmSqlDDLSync.ExecutionCallback<any>)
        }
        getCollectionIndexes: {
            (driver: FxOrmSqlDDLSync__Driver.Driver, name: string, cb: FxOrmSqlDDLSync.ExecutionCallback<any>)
        }
        addIndex: {
            (driver: FxOrmSqlDDLSync__Driver.Driver, name: string, unique: boolean, collection: FxOrmSqlDDLSync.TableName, columns: string[], cb: FxOrmSqlDDLSync.ExecutionCallback<any>)
        }
        removeIndex: {
            (driver: FxOrmSqlDDLSync__Driver.Driver, name: string, collection: FxOrmSqlDDLSync.TableName, cb: FxOrmSqlDDLSync.ExecutionCallback<any>)
        }
        getType: {
            (collection: FxOrmSqlDDLSync.TableName, property: FxOrmSqlDDLSync__Column.PropertySQLite, driver: FxOrmSqlDDLSync__Driver.Driver)
        }

        /**
         * process composite keys
         */
        processKeys?: {
            (keys: string[])
        }
        /**
         * transform type between property and column
         */
        supportsType?: {
            (type: string)
        }
    }

    interface DialectResult<T = any> {
		value: T,
		before?: false | Function
	}
}