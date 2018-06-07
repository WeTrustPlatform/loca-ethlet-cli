/**
 * @abstract Abstract class which all providers extend from
 */
class WalletProvider {
  /**
   * Cannot be contructed directly. Must extend
   */
  constructor() {
    if (new.target === WalletProvider) {
      throw new TypeError('Cannot construct WalletProvider directly');
    }
  }

  /**
   * Get public address
   * @abstract
   * @return {Promise} address: string
   */
  async getAddress() {
    throw new Error('Subclass of WalletProvider does not implement getAddress');
  }

  /**
   * Sign a transaction
   * @abstract
   * @param {object} txParams
   * @return {EthTx} signed ethereumjs-tx object
   */
  async signTransaction(txParams) {
    throw new Error('Subclass of Wallet does not implement sign');
  }

  /**
   * Close the connection
   * (Optional)
   */
  async close() {}
}

exports = module.exports = WalletProvider;
