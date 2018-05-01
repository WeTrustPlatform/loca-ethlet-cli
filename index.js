const fs = require('fs');
const glob = require('glob');
const path = require('path');
const assert = require('assert');
const Web3 = require('web3');
const validator = require('./lib/validators').locaEthletInit;
const getCredential = require('./lib/getCredential');

const Ethlet = function Ethlet(options) {
  if (!validator(options)) {
    throw new Error(JSON.stringify(validator.errors));
  }

  this.web3 = new Web3(new Web3.providers.HttpProvider(options.rpc));

  this.credential = getCredential(options.keystore, options.password, this.web3);

  this.execute = async (actionName, dataFile) => {
    assert.ok(
      (supportedActions.indexOf(actionName.toLowerCase()) > -1),
      `Action '${actionName}' is invalid. Supported actions: ${[...supportedActions]}`);

    assert.ok(dataFile, `Missing the location of datafile`);

    const dataFileContent = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    return Ethlet[actionName.toLowerCase()](dataFileContent, this.credential, this.web3);
  };

  this.supportedActions = supportedActions;

  return this;
};

let actionModules = glob.sync('./actions/*.js');
let supportedActions = [];
actionModules.forEach((f) => {
  const fileName = path.basename(f);
  const actionName = fileName.split('.')[0].toLowerCase();
  supportedActions.push(actionName);
  Ethlet[actionName] = require(f);
});

exports = module.exports = Ethlet;
