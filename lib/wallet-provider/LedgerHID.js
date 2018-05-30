const HID = require('node-hid');
const WalletProvider = require('./WalletProvider');
const TransportHID = require('@ledgerhq/hw-transport-node-hid').default;
const Eth = require('@ledgerhq/hw-app-eth').default;

/**
 * Ledger HID Provider
 * @override
 */
class LedgerHID extends WalletProvider {
  /**
   * @override
   */
  constructor(options = {}) {
    super();
    const { path, device } = options;
    this.path = path || "44'/60'/0'/0'/0";
    this.device = device || this._getDevice();
    const transport = new TransportHID(this.device);
    this._eth = new Eth(transport);
  }

  /**
   * Helper: get USB device
   * @return {HID} device
   */
  _getDevice() {
    const connectedDevices = HID.devices();
    const ledger = connectedDevices.find(
      d => d.manufacturer.toLowerCase() === 'ledger',
    );
    console.log(JSON.stringify(`Ledger Device: ${JSON.stringify(ledger)}`));
    return new HID.HID(ledger.path);
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

exports = module.exports = LedgerHID;
