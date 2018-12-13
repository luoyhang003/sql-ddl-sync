const test = require('test')
test.setup()

require('./integration/basic')
require('./integration/sql')

require('./integration/mysql')
require('./integration/sqlite')

test.run(console.DEBUG)
process.exit()