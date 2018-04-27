/**
 * Interact with smart contracts
 * Usage:
 * node interact.js -h
 */
const parser = require('./argsParser');
const getCredential = require('./getCredential');
const signAndSubmit = require('./signAndSubmit');
const Web3 = require('web3');
const path = require('path');
const fs = require('fs');
const assert = require('assert');

const args = parser.parseArgs();
console.log(`Args:
  ${JSON.stringify(args)}`);

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

const web3 = new Web3(new Web3.providers.HttpProvider(args.rpc));

const {address : senderAddress, privateKey} = getCredential(args.keystore, args.password, web3.eth.accounts.decrypt);

const contractInstance = new web3.eth.Contract(abi, contractAddress);

const data = contractInstance.methods[methodName](...parameters).encodeABI();

signAndSubmit(
  {
    from: senderAddress,
    to: contractAddress,
    data,
    value,
    chainId,
    gasLimit,
    gasPrice,
  },
  privateKey,
  web3
).then(() => console.log('DONE'));
