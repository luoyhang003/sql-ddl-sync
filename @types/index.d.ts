/// <reference types="fibjs" />

/// <reference path="_common.d.ts" />
/// <reference path="SQL.d.ts" />
/// <reference path="Driver.d.ts" />
/// <reference path="Column.d.ts" />
/// <reference path="Dialect.d.ts" />

declare namespace FxOrmSqlDDLSync {
    interface SyncOptions {
        driver: {
            dialect: FxSqlQueryDialect.DialectType
            [ext_cfg: string]: any
        }
        debug?: Function | boolean
        suppressColumnDrop?: boolean
    }
    interface SyncInstance {
        defineCollection(collection, properties): SyncInstance
        defineType(type: string, proto: FxOrmSqlDDLSync__Driver.CustomPropertyType): SyncInstance
        sync<T=any>(cb?: FxOrmSqlDDLSync.ExecutionCallback<T>): any
    }

    interface ExportModule {
        dialect(name: string): FxOrmSqlDDLSync__Dialect.Dialect
        Sync: {
            new (options: SyncOptions): SyncInstance
            (options: SyncOptions): SyncInstance
        }
    }
}

declare module "@fxjs/sql-ddl-sync" {
    const mod: FxOrmSqlDDLSync.ExportModule
    export = mod
}