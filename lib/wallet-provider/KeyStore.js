const fs = require('fs');
const Web3 = require('web3');
const EthTx = require('ethereumjs-tx');
const WalletProvider = require('./WalletProvider');
const { remove0x } = require('../util');

/**
 * KeyStore Provider
 * @override
 */
class KeyStore extends WalletProvider {
  /**
   * @override
   * @param {object} options
   *  {keystore: 'path to keystore.json', password: 'path to password file'}
   */
  constructor(options) {
    super();
    const { keystore, password } = options;
    const keyStoreContent = JSON.parse(fs.readFileSync(keystore, 'utf8'));
    const passwordContent = fs.readFileSync(password, 'utf8').trim();
    this._credential = new Web3().eth.accounts.decrypt(
      keyStoreContent,
      passwordContent,
    );
    this._credential.signingKey = Buffer.from(
      remove0x(this._credential.privateKey),
      'hex',
    );
  }

  /**
   * @override
   */
  async getAddress() {
    return this._credential.address;
  }

  /**
   * @override
   */
  async signTransaction(txParams) {
    const tx = new EthTx(txParams);
    tx.sign(this._credential.signingKey);
    return tx;
  }
}

exports = module.exports = KeyStore;
