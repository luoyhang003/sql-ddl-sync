/// <reference types="@fxjs/sql-query" />
/// <reference path="_common.d.ts" />

declare namespace FxOrmSqlDDLSync__Driver {
    interface CustomPropertyType {
        datastoreType(prop?): string
        valueToProperty?(value?, prop?)
        propertyToValue?(value?, prop?)

        [ext_cfg_name: string]: any
    }

    interface DriverConfig {
        database: string

        [ext_cfg_name: string]: any
    }
    /**
     * @description one protocol driver should implement
     */
    interface Driver {
        dialect: FxOrmSqlDDLSync__Dialect.DialectType
        config: DriverConfig
        query: FxSqlQuery.Class_Query

        /**
         * @description sync table/collection
         */
        sync
        
        /**
         * @description drop table/collection
         */
        drop

        /**
         * @description base query
         */
        execSimpleQuery: {
            <T = any>(query_string: string, cb: FxOrmSqlDDLSync.ExecutionCallback<T>)
        }
        
        /**
         * @description do query
         */
        execQuery: {
            <T = any>(query_string: string, cb: FxOrmSqlDDLSync.ExecutionCallback<T>)
            <T = any>(query_string: string, query_args: object, cb: FxOrmSqlDDLSync.ExecutionCallback<T>)
        }
        
        /**
         * @description do eager-query
         */
        eagerQuery: {
            <T = any>(association, opts, keys, cb: FxOrmSqlDDLSync.ExecutionCallback<T>)
        }

        customTypes: {
            [type_name: string]: CustomPropertyType
        }
    }

    interface IndexRow {
        [k: string]: any
    }

    interface IndexRow_MySQL extends IndexRow {
        index_name: string
        column_name: string

        non_unique: number|boolean
    }

    interface IndexRow_SQLite extends IndexRow {
        name: string

        unique: number|boolean
    }
}