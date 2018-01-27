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
  ['-k', '--keystore'],
  { 
    help: 'path to the keystore file',
    required: true
  }
);

parser.addArgument(
  ['-p', '--password'],
  { 
    help: 'password to decrypt the keystore',
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
const assert = require('assert');
const ethTx = require('ethereumjs-tx');

const args = parser.parseArgs();

assert.ok(path.existsSync(args.datafile), `Cannot find ${args.datafile}`);
assert.ok(path.existsSync(args.keystore), `Cannot find ${args.keystore}`);

const dataFileContent = JSON.parse(fs.readFileSync(args.datafile, 'utf8'));
assert.ok(dataFileContent.bytecode, 'Cannot find bytecode in datafile');

const web3 = new Web3(new Web3.providers.HttpProvider(args.rpc));

const keystoreContent = JSON.parse(fs.readFileSync(args.keystore, 'utf8'));
const decryptedKeystore = web3.eth.accounts.decrypt(keystoreContent, args.password);

const txParams = {
  nonce: '0x6', // Replace by nonce for your account on geth node
  gasPrice: web3.toHex(dataFileContent.gasPrice || web3.eth.gasPrice), 
  gasLimit: web3.toHex(dataFileContent.gasLimit || 3000000),
  data: dataFileContent.bytecode,
  from: decryptedKeystore.address,
  value: '0x0'
};

const tx = new ethTx(txParams);
tx.sign(privKey);
const serializedTx = tx.serialize();
const rawTx = '0x' + serializedTx.toString('hex');
console.log(rawTx);
web3.eth.sendRawTransaction(rawTx);
