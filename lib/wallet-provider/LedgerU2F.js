const WalletProvider = require('./WalletProvider');
const TransportU2F = require('@ledgerhq/hw-transport-u2f').default;
const Eth = require('@ledgerhq/hw-app-eth').default;

/**
 * Ledger Provider
 * @override
 */
class LedgerU2F extends WalletProvider {
  /**
   * @override
   */
  constructor(options = {}) {
    super();
    const { path } = options;
    this.path = path || "44'/60'/0'/0'/0";
    const transport = new TransportU2F();
    this._eth = new Eth(transport);
  }

  /**
   * Helper: get U2F transport on demand
   * @return {Transport} transport
   */
  async _getTransport() {
    const transport = await TransportU2F.create();
    return transport;
  }

  /**
   * @override
   */
  async getAddress() {
    if (!this.address) {
      const { address } = await this._eth.getAddress(this.path, true);
      this.address = address;
    }

    return this.address;
  }

  /**
   * @override
   */
  async sign(message) {
    return this._eth.signTransaction(this.path, message);
  }
}

exports = module.exports = LedgerU2F;
