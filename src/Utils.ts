import util = require('util');

export function syncObject (o: object, method_names: string[], self: any = o) {
    method_names.forEach(m => {
        if (typeof o[m] !== 'function')
            return

        const func = o[m]
        o[m + 'Sync'] = util.sync(func).bind(self)
    })
}

export function syncCallback (func: FxOrmSqlDDLSync.NextCallbackWrapper, self: any) {
    return util.sync(func).bind(self)
}