/// <reference types="fibjs" />

/// <reference path="_common.d.ts" />
/// <reference path="SQL.d.ts" />
/// <reference path="Driver.d.ts" />
/// <reference path="Column.d.ts" />
/// <reference path="Dialect.d.ts" />

declare namespace FxOrmSqlDDLSync {
    interface SyncOptions {
        debug: Function | boolean
        driver: {
            dialect: FxSqlQueryDialect.DialectType
            [ext_cfg: string]: any
        }
        suppressColumnDrop: boolean
    }
    interface SyncInstance {
        defineCollection(collection, properties): SyncInstance
        defineType(type, proto): SyncInstance
        sync(cb): any
    }

    interface ExportModule {
        dialect(name: string): FxOrmSqlDDLSync__Dialect.Dialect
        Sync: {
            new (options: SyncOptions): SyncInstance
            (options: SyncOptions): SyncInstance
        }
    }
}