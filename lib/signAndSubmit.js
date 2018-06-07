const assert = require('assert');
const { prepend0x } = require('../lib/util');

/**
 * Sign a TX object and submit to the network
 * @param {object} txParams
 * @param {WalletProvider} walletProvider
 * @param {Web3} web3
 * @return {Promise} result of web3.eth.sendSignedTransaction
 *
 */
exports = module.exports = async function signAndSubmit(
  txParams,
  walletProvider,
  web3,
) {
  const signerAddress = await walletProvider.getAddress();

  const nonce = await web3.eth.getTransactionCount(signerAddress);

  const networkId = await web3.eth.net.getId();
  assert.ok(txParams.chainId === networkId, 'Signing on wrong network');

  const formattedParams = Object.assign({}, txParams, {
    nonce,
    from: signerAddress,
    gas: web3.utils.toHex(txParams.gasLimit || 5000000),
    gasPrice: web3.utils.toHex(
      txParams.gasPrice || web3.utils.toWei('50', 'gwei'),
    ),
    value: web3.utils.toHex(txParams.value || 0),
  });

  console.log(`Sign payload:
    ${JSON.stringify(formattedParams)}`);

  const signedEthTx = await walletProvider.signTransaction(formattedParams);
  console.log(`Transaction hash: ${signedEthTx.hash(true).toString('hex')}`);

  const txHex = prepend0x(signedEthTx.serialize().toString('hex'));
  const txResult = await web3.eth.sendSignedTransaction(txHex);

  console.log(`Tx Result:
    ${JSON.stringify(txResult)}`);

  return txResult;
};
