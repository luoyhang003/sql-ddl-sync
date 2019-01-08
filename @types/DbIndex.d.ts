declare namespace FxOrmSqlDDLSync__DbIndex {
    interface DbIndexInfo {
        name: string
        columns: string[]
        unique?: boolean
    }
}