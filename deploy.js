/**
 * Deployment Script
 * Usage:
 * node deploy.js -h 
 */

const ArgumentParser = require('argparse').ArgumentParser;
const parser = new ArgumentParser({
  version: '0.0.1',
  addHelp: true,
  description: 'Smart Contract Deployment Script'
});

parser.addArgument(
  ['-k', '--privatekey'],
  { 
    help: 'private key',
    required: true
  }
);

parser.addArgument(
  ['-d', '--datafile'],
  { 
    help: 'path to the datafile',
    required: true
  }
);

parser.addArgument(
  ['-r', '--rpc'],
  { 
    help: 'geth rpc url',
    required: true
  }
);

const Web3 = require('web3');
const path = require('path'); 
const fs = require('fs');
const assert = require('assert');
const ethTx = require('ethereumjs-tx');

const args = parser.parseArgs();
console.log(`Args: ${JSON.stringify(args)}`);

const { bytecode: rawBytecode, abi, gasPrice, gasLimit, constructors = [] } = JSON.parse(fs.readFileSync(args.datafile, 'utf8'));
assert.ok(rawBytecode, 'Cannot find bytecode in datafile');
console.log(`rawBytecode: ${rawBytecode}`);
const bytecode = rawBytecode.startsWith('0x') ? rawBytecode : `0x${rawBytecode}`;

const web3 = new Web3(new Web3.providers.HttpProvider(args.rpc));

// const keystoreContent = JSON.parse(fs.readFileSync(args.keystore, 'utf8'));
// const { address: creatorAddress } = web3.eth.accounts.decrypt(keystoreContent, args.password);

// const { address: creatorAddress } = web3.eth.accounts.privateKeyToAccount(args.privatekey);
const creatorAddress = '0x4b5f88e2ba45Da7682349A376d3143fBDb7Ac1Cf';

const contract = web3.eth.contract(abi);
const contractData = contract.new.getData(...constructors.concat({
  data: bytecode
}));

const nonce =  web3.eth.getTransactionCount(creatorAddress);
const txParams = {
  nonce: web3.toHex(nonce),
  gasPrice: web3.toHex(gasPrice || web3.eth.gasPrice), 
  gasLimit: web3.toHex(gasLimit || 3000000),
  data: contractData,
  from: creatorAddress,
  value: '0x0',
};

const tx = new ethTx(txParams);
tx.sign(new Buffer(args.privatekey, 'hex'));
const serializedTx = tx.serialize();
const hexTx = serializedTx.toString('hex');
console.log(`hexTx ${hexTx}`);
web3.eth.sendRawTransaction('0x' + hexTx, (err, txHash) => {
  if (err) throw err;
  console.log(`Tx Hash ${txHash}`);
});
