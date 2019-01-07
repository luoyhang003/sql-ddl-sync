declare namespace FxOrmSqlDDLSync {
    type TableName = string
    type ColumnName = string

    interface ExecutionCallback<T> {
        (err?: Error|null, result?: T): any
    }
}