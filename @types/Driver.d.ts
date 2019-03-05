/// <reference types="@fxjs/sql-query" />
/// <reference path="_common.d.ts" />

declare namespace FxOrmSqlDDLSync__Driver {
    interface CustomPropertyType {
        datastoreType(prop?: any): string
        valueToProperty?(value?: any, prop?: any): any
        propertyToValue?(value?: any, prop?: any): any

        [ext_cfg_name: string]: any
    }

    interface CustomPropertyTypeHash {
        [key: string]: CustomPropertyType
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
        sync: any
        
        /**
         * @description drop table/collection
         */
        drop: any

        /**
         * @description base query
         */
        execSimpleQuery: {
            <T = any>(query_string: string, cb: FxOrmSqlDDLSync.ExecutionCallback<T>): void
        }
        
        /**
         * @description do query
         */
        execQuery: {
            <T = any>(query_string: string, cb: FxOrmSqlDDLSync.ExecutionCallback<T>): void
            <T = any>(query_string: string, query_args: object, cb: FxOrmSqlDDLSync.ExecutionCallback<T>): void
        }
        
        /**
         * @description do eager-query
         */
        eagerQuery: {
            <T = any>(
                association: any,
                opts: any,
                keys: any,
                cb: FxOrmSqlDDLSync.ExecutionCallback<T>
            ): void
        }

        customTypes: {
            [type_name: string]: CustomPropertyType
        }
    }

    interface DbIndexInfo_MySQL extends FxOrmSqlDDLSync__DbIndex.DbIndexInfo {
        index_name: string
        column_name: string

        non_unique: number|boolean
    }

    interface DbIndexInfo_SQLite extends FxOrmSqlDDLSync__DbIndex.DbIndexInfo {
        unique: boolean
    }
}