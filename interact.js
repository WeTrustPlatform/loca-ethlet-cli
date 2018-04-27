const parser = require('./argsParser');
const Web3 = require('web3');
const path = require('path');
const fs = require('fs');
const assert = require('assert');
const ethTx = require('ethereumjs-tx');

const args = parser.parseArgs();
console.log(`Args: ${JSON.stringify(args)}`);

const {
  contractAddress,
  abi,
  chainId,
  gasPrice,
  gasLimit,
  methodName,
  value,
  parameters = []
} = JSON.parse(fs.readFileSync(args.datafile, 'utf8'));
assert.ok(abi, 'Cannot find abi in datafile');
assert.ok(contractAddress, 'Cannot find contractAddress in datafile');
assert.ok(methodName, 'Cannot find methodName in datafile');
assert.ok(chainId, 'Cannot find chainId in datafile');

const web3 = new Web3(new Web3.providers.HttpProvider(args.rpc));

const keystoreContent = JSON.parse(fs.readFileSync(args.keystore, 'utf8'));
const password = fs.readFileSync(args.password, 'utf8').trim();

const {address : senderAddress, privateKey} =
    web3.eth.accounts.decrypt(keystoreContent, password);

const contractInstance = new web3.eth.Contract(abi, contractAddress);

const data = contractInstance.methods[methodName](...parameters).encodeABI();

async function main() {
  const nonce = await web3.eth.getTransactionCount(senderAddress);
  console.log(`Nonce: ${nonce}`);
  const txParams = {
    nonce : web3.utils.toHex(nonce),
    gasPrice : web3.utils.toHex(gasPrice || web3.eth.gasPrice ||
                                web3.utils.toWei('50', 'gwei')),
    gasLimit : web3.utils.toHex(gasLimit || 3000000),
    data : data,
    from : senderAddress,
    to : contractAddress,
    value : value || '0x0',
    chainId : chainId,
  };

  console.log(JSON.stringify(txParams));
  const tx = new ethTx(txParams);

  const formattedPrivateKey =
      privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;
  tx.sign(Buffer.from(formattedPrivateKey, 'hex'));
  const serializedTx = tx.serialize();
  const hexTx = serializedTx.toString('hex');
  console.log(`hexTx ${hexTx}`);
  const txResult = await web3.eth.sendSignedTransaction('0x' + hexTx);
  console.log(`DONE Result:
    ${JSON.stringify(txResult)}`);
}

main();
