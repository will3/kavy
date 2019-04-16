const NodeEnvironment = require('jest-environment-node');
const { connect } = require('../../cli/server');

class KavyEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
    this.testPath = context.testPath;
  }

  async setup() {
    await super.setup();

    console.log('------- setup -------');

    this.global.kv = await new Promise((resolve, reject) => {
        this.closeServer = connect((r) => {
            resolve(r);
        });
    });
  }

  async teardown() {
    this.global.kv = null;
    await this.closeServer();
    
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = KavyEnvironment;