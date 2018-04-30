const fs = require('fs');
const glob = require('glob');
const assert = require('assert');
const validator = require('./lib/validators').locaEthletInit;
const getCredential = require('../lib/getCredential');

const actions = {};
let actionModules = glob.sync('./actions/*.js');
actionModules.forEach((f) => {
  const fileName = path.basename(f);
  actions[fileName.split('.')[0]] = require(f);
});

const Ethlet = function Ethlet(options) {
  if (!validator(options)) {
    throw new Error(JSON.stringify(validator.errors));
  }

  this.web3 = new Web3(new Web3.providers.HttpProvider(options.rpc));
  this.credential = getCredential(options.keystore, options.password, web3.eth.accounts.decrypt);

  this.execute = async (actionName, dataFile) => {
    assert.ok(
      !(actionName in actions),
      `Action '${actionName}' is invalid. Supported actions: ${[...Object.keys(actions)]}`);

    assert.ok(dataFile, `Missing the location of datafile`);

    const dataFileContent = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    return actions[actionName](dataFileContent, this.credential, this.web3);
  };

  return this;
};
exports = module.exports = Ethlet;
