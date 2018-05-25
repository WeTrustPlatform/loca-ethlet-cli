const signAndSubmit = require('../lib/signAndSubmit');
const validator = require('../lib/validators').send;

/**
 * Send ETH
 * @param {object} sendParams
 * @param {WalletProvider} walletProvider
 * @param {Web3} web3
 * @return {Promise}
 */
exports = module.exports = async function send(
  sendParams,
  walletProvider,
  web3,
) {
  if (!validator(sendParams)) {
    throw new Error(JSON.stringify(validator.errors));
  }

  const { chainId, value, gasPrice, gasLimit, to, data } = sendParams;

  return signAndSubmit(
    {
      to,
      value,
      chainId,
      data: web3.utils.toHex(data),
      gasLimit,
      gasPrice,
    },
    walletProvider,
    web3,
  );
};
