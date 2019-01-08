/// <reference types="fibjs" />

/// <reference path="_common.d.ts" />
/// <reference path="SQL.d.ts" />
/// <reference path="Collection.d.ts" />
/// <reference path="DbIndex.d.ts" />
/// <reference path="Driver.d.ts" />
/// <reference path="Column.d.ts" />
/// <reference path="Dialect.d.ts" />

declare namespace FxOrmSqlDDLSync {
    interface SyncOptions {
        driver: FxOrmSqlDDLSync__Driver.Driver
        debug?: Function | boolean
        suppressColumnDrop?: boolean
    }
    interface SyncConstructor {
        (options: SyncOptions): void
        prototype: Sync
    }
    interface SyncResult {
        changes: number
    }
    interface Sync {
        defineCollection: {
            (collection: FxOrmSqlDDLSync__Collection.Collection, properties: FxOrmSqlDDLSync__Collection.Collection['properties']): Sync
        }
        defineType: {
            (type: string, proto: FxOrmSqlDDLSync__Driver.CustomPropertyType): Sync
        }
        sync: {
            (cb?: FxOrmSqlDDLSync.ExecutionCallback<SyncResult>): void
        }
    }
    // compatible
    type SyncInstance = Sync

    interface ExportModule {
        dialect(name: string): FxOrmSqlDDLSync__Dialect.Dialect
        Sync: {
            new (options: SyncOptions): void
            (options: SyncOptions): Sync
        }
    }
}

declare module "@fxjs/sql-ddl-sync" {
    const mod: FxOrmSqlDDLSync.ExportModule
    export = mod
}