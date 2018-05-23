/**
 * @abstract Abstract class which all providers extend from
 *
 * Required:
 * async getAddress(): Promise(address: string)
 * async sign(message: string): Promise({v,r,s})
 */
class WalletProvider {
  /**
   * Cannot be contructed
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
   * Sign a message
   * @abstract
   * @param {string} message
   * @return {Promise} {v,s,r}
   */
  async sign(message) {
    throw new Error('Subclass of Wallet does not implement sign');
  }
}

exports = module.exports = WalletProvider;
