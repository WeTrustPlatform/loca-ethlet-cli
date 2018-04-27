const getCredential = require('../lib/getCredential');
const signAndSubmit = require('./lib/signAndSubmit');
const Web3 = require('web3');
const fs = require('fs');
const assert = require('assert');

exports = module.exports = async function deploy(args) {
  const {
    chainId,
    bytecode: rawBytecode,
    abi,
    gasPrice,
    gasLimit,
    parameters = [],
  } = JSON.parse(fs.readFileSync(args.datafile, 'utf8'));

  assert.ok(rawBytecode, 'Cannot find bytecode in datafile');
  assert.ok(abi, 'Cannot find abi in datafile');
  assert.ok(chainId, 'Cannot find chainId in datafile');

  const bytecode =
      rawBytecode.startsWith('0x') ? rawBytecode : `0x${rawBytecode}`;

  const web3 = new Web3(new Web3.providers.HttpProvider(args.rpc));
  const {
    address: creatorAddress,
    privateKey,
  } = getCredential(args.keystore, args.password, web3.eth.accounts.decrypt);

  const contract = new web3.eth.Contract(abi);
  const data = contract.deploy({
    data: bytecode,
    arguments: parameters,
    }).encodeABI();

  return signAndSubmit(
  {
    from: creatorAddress,
    data,
    value,
    chainId,
    gasLimit,
    gasPrice,
  },
  privateKey,
  web3);
};
