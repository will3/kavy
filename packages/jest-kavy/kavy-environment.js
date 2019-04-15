const NodeEnvironment = require('jest-environment-node');
const { connect } = require('../../cli/server');
const libPath = require('path');

class KavyEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
    this.testPath = context.testPath;
  }

  async setup() {
    await super.setup();

    console.log('------- setup -------');

    this.global.runner = await new Promise((resolve, reject) => {
        this.closeServer = connect((r) => {
            resolve(r);
        });
    });
    const file = libPath.relative(__dirname, __filename);
    this.global.runner.file = file;
  }

  async teardown() {
    this.global.runner = null;
    await this.closeServer();
    
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = KavyEnvironment;