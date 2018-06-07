const HID = require('node-hid');
const TransportHID = require('@ledgerhq/hw-transport-node-hid').default;
const Eth = require('@ledgerhq/hw-app-eth').default;
const EthTx = require('ethereumjs-tx');
const WalletProvider = require('./WalletProvider');

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
    this.path = path || "44'/60'/0'/0";
    this._transport = transport || new TransportHID(LedgerHID._getDevice());
    this._eth = new Eth(this._transport);
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
  async signTransaction(txParams) {
    const tx = new EthTx(txParams);

    // EIP155
    tx.raw[6] = Buffer.from([txParams.chainId]);
    tx.raw[7] = Buffer.from([]);
    tx.raw[8] = Buffer.from([]);

    const toBeSigned = tx.serialize().toString('hex');
    console.log('Please confirm the transaction on the Ledger.');
    const { v, r, s } = await this._eth.signTransaction(this.path, toBeSigned);

    tx.v = Buffer.from(v, 'hex');
    tx.r = Buffer.from(r, 'hex');
    tx.s = Buffer.from(s, 'hex');

    return tx;
  }

  /**
   * @override
   */
  async close() {
    await this._transport.close();
  }
}

exports = module.exports = LedgerHID;
