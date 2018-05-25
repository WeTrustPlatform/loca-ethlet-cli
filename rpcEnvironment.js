const NodeEnv = require('jest-environment-node');

/**
 * RpcEnv for each test suite
 */
class RpcEnv extends NodeEnv {
  /**
   * @override
   */
  async setup() {
    await super.setup();
    this.global.__RPC__ = process.__RPC__;
  }
}

exports = module.exports = RpcEnv;
