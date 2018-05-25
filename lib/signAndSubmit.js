const assert = require('assert');
const EthTx = require('ethereumjs-tx');
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

  const tx = new EthTx(formattedParams);

  const signature = await walletProvider.sign(tx.hash(false).toString('hex'));

  // EIP155
  //
  signature.v += networkId * 2 + 8;

  // Get new TX object with the signature
  const serializedTx = Object.assign(tx, signature).serialize();
  const hexTx = prepend0x(serializedTx.toString('hex'));

  const txResult = await web3.eth.sendSignedTransaction(hexTx);

  console.log(`Tx Result:
    ${JSON.stringify(txResult)}`);

  return txResult;
};
