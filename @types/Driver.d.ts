/// <reference types="@fxjs/sql-query" />

declare namespace FxOrmSqlDDLSync__Driver {
    interface DriverConfig {
        database: string

        [ext_cfg_name: string]: any
    }
    /**
     * @description one protocol driver should implement
     */
    interface Driver {
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
            <T = any>(query_language: string, cb: FxOrmSqlDDLSync.ExecutionCallback<T>)
        }
        
        /**
         * @description do query
         */
        execQuery: {
            <T = any>(query_language: string, cb: FxOrmSqlDDLSync.ExecutionCallback<T>)
            <T = any>(query_language: string, query_args: object, cb: FxOrmSqlDDLSync.ExecutionCallback<T>)
        }
        
        /**
         * @description do eager-query
         */
        eagerQuery: {
            <T = any>(association, opts, keys, cb: FxOrmSqlDDLSync.ExecutionCallback<T>)
        }

        customTypes: {
            [type_name: string]: any
        }
    }

    interface IndexRow_MySQL {
        index_name: string
        column_name: string

        non_unique: number|boolean
    }

    interface IndexRow_SQLite {
        name: string

        unique: number|boolean
    }
}