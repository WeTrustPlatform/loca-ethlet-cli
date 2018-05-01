const assert = require('assert');
const EthTx = require('ethereumjs-tx');

exports = module.exports = async function signAndSubmit(
  txParams,
  {address: signerAddress, privateKey},
  web3) {
  const nonce = await web3.eth.getTransactionCount(signerAddress);

  const networkId = await web3.eth.net.getId();
  assert.ok(txParams.chainId === networkId, 'Signing on wrong network');

  const formattedParams = Object.assign({}, txParams,
    {
      nonce,
      from: signerAddress,
      gas: web3.utils.toHex(txParams.gasLimit || 5000000),
      gasPrice: web3.utils.toHex(
        txParams.gasPrice || web3.utils.toWei('50', 'gwei')),
      value: web3.utils.toHex(txParams.value || 0),
    });

  console.log(`Params:
    ${JSON.stringify(formattedParams)}`);

  const formattedPrivateKey = privateKey.startsWith('0x') ?
    privateKey.slice(2) : privateKey;

  console.log('Private ' + formattedPrivateKey);
  const tx = new EthTx(formattedParams);

  tx.sign(Buffer.from(formattedPrivateKey, 'hex'));

  const serializedTx = tx.serialize();
  const hexTx = serializedTx.toString('hex');

  const txResult = await web3.eth.sendSignedTransaction(`0x${hexTx}`);

  console.log(`Tx Result:
    ${JSON.stringify(txResult)}`);

  return txResult;
};
