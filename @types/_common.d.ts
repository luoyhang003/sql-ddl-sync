declare namespace FxOrmSqlDDLSync {
    type TableName = string
    type ColumnName = string

    interface ExecutionCallback<T> {
        (err: string|Error|null, result?: T): any
    }
}