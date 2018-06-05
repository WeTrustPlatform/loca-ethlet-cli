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
    let { path, transport } = options;
    this.path = path || "44'/60'/0'/0'/0";
    if (!transport) {
      let device = LedgerHID._getDevice();
      transport = new TransportHID(device);
    }
    this._eth = new Eth(transport);
  }

  /**
   * Helper: get USB device
   * @return {HID} device
   */
  static _getDevice() {
    const connectedDevices = HID.devices();
    const ledger = connectedDevices.find(
      d => d.manufacturer.toLowerCase() === 'ledger',
    );
    if (!ledger) {
      throw new Error(
        'Cannot find Ledger. Please enter pin and go to the ETH app on the ledger.',
      );
    }
    console.log(JSON.stringify(`Ledger Device: ${JSON.stringify(ledger)}`));
    return new HID.HID(ledger.path);
  }

  /**
   * @override
   */
  async getAddress() {
    if (!this.address) {
      try {
        console.log('Please confirm the address on the Ledger.');
        const { address } = await this._eth.getAddress(this.path, true);
        this.address = address;
      } catch (e) {
        if (e.message === 'Invalid channel') {
          throw new Error(
            `Please set the BrowserSupport to 'no'.
          Refer to https://support.ledgerwallet.com/hc/en-us/articles/115005198565-Switch-browser-support`,
          );
        } else {
          throw e;
        }
      }
    }
    return this.address;
  }

  /**
   * @override
   */
  async sign(message) {
    console.log('Please confirm the transaction on the Ledger.');
    return this._eth.signTransaction(this.path, message);
  }
}

exports = module.exports = LedgerHID;
