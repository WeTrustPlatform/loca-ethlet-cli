/**
 * Deployment Script
 * Usage:
 * node deploy.js -h 
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

const { chainId, bytecode: rawBytecode, abi, gasPrice, gasLimit, parameters = [] } = JSON.parse(fs.readFileSync(args.datafile, 'utf8'));

assert.ok(rawBytecode, 'Cannot find bytecode in datafile');
assert.ok(abi, 'Cannot find abi in datafile');
assert.ok(chainId, 'Cannot find chainId in datafile');

const bytecode = rawBytecode.startsWith('0x') ? rawBytecode : `0x${rawBytecode}`;

const web3 = new Web3(new Web3.providers.HttpProvider(args.rpc));
const { address: creatorAddress, privateKey } = getCredential(args.keystore, args.password, web3.eth.accounts.decrypt); 

const contract = new web3.eth.Contract(abi);
const data = contract.deploy({
  data: bytecode,
  arguments: parameters,
}).encodeABI();


signAndSubmit(
  {
    from: creatorAddress,
    data,
    value,
    chainId,
    gasLimit,
    gasPrice,
  },
  privateKey,
  web3
).then(() => console.log('DONE'));
