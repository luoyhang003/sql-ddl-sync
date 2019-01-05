declare namespace FxOrmSqlDDLSync__Column {
    interface PropertyDescriptor {
    }

    type StringType<ENUM_T = string> = string | ENUM_T

    type PropertyType = StringType<'text' | 'integer' | 'number' | 'serial' | 'boolean' | 'date' | 'binary' | 'object' | 'enum' | 'point'>

    type PropertyType_MySQL = PropertyType
    type ColumnType_MySQL =
        StringType<'TEXT' | 'INT' | 'TINYINT' | 'DATE' | 'DATETIME' | 'LONGBLOB' | 'BLOB' | 'ENUM' | 'POINT'>

    interface PropertyDescriptor__MySQL {
        Field: string
        Type: string
            | 'smallint'
            | 'integer'
            | 'bigint'
            | 'int'
            | 'float'
            | 'double'
            | 'tinyint'
            | 'datetime'
            | 'date'
            | 'longblob'
            | 'blob'
            | 'varchar'
        SubType?: string[]
        Size: number
        /**
         * extra description such as `AUTO_INCREMENT`
         */
        Extra: string

        /**
         * @example `PRI`
         */
        Key: string
        /**
         * @example `no`
         */
        Null: string
        /**
         * @example null
         */
        Default?: any
    }

    interface Property {
        serial: boolean
        unsigned: boolean
        primary: boolean
        required: boolean
        defaultValue: any
        type: string

        /* extra option :start */
        size: number | string
        // whether float type
        rational: boolean
        time: boolean
        big: boolean
        // values for enum type
        values: any[]
        /* extra option :end */
    }

    interface PropertyMySQL extends Property {
    }

    type PropertyType_SQLite = PropertyType
    type ColumnType_SQLite =
        StringType<'TEXT' | 'INTEGER' | 'REAL' | 'SERIAL' | 'INTEGER UNSIGNED' | 'DATE' | 'DATETIME' | 'BLOB' | 'ENUM' | 'POINT'>

    interface PropertySQLite extends Property {
        key: boolean
        type: PropertyType_SQLite
    }

    interface OpResult__CreateColumn {
        value: string
        before: Function
    }
}