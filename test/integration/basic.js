const test = require('test')
test.setup()

var index   = require("../../lib");

describe("index", function () {
  describe("exports", function () {
    it("should expose Sync function", function () {
      assert.exist(index.Sync)
      assert.equal(typeof index.Sync, 'function');
    });

    it("should expose dialect function", function () {
      assert.exist(index.dialect)
      assert.equal(typeof index.dialect, 'function');
    });
  });

  describe("#dialect", function () {
    ['mysql', /* 'postgresql', */ 'sqlite'].forEach(function (dialectName) {
      it("should expose " + dialectName + " dialect", function () {
        var dialect = index.dialect(dialectName);

        assert.exist(dialect);
        console.log(dialect);
      });
    });
  });
});

if (require.main === module) {
  test.run(console.DEBUG)
  process.exit()
}