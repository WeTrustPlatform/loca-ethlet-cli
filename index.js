// Copyright (C) 2018 WeTrustPlatform
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

const fs = require('fs');
const glob = require('glob');
const path = require('path');
const assert = require('assert');
const Web3 = require('web3');
const validator = require('./lib/validators').locaEthletInit;

const Ethlet = function Ethlet(options) {
  if (!validator(options)) {
    throw new Error(JSON.stringify(validator.errors));
  }

  this.web3 = new Web3(new Web3.providers.HttpProvider(options.rpc));

  this.walletProvider = options.walletProvider;

  this.execute = async (actionName, dataFile) => {
    assert.ok(
      supportedActions.indexOf(actionName.toLowerCase()) > -1,
      `Action '${actionName}' is invalid. Supported actions: ${[
        ...supportedActions,
      ]}`,
    );

    assert.ok(dataFile, `Missing the location of datafile`);

    const dataFileContent = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    return Ethlet[actionName.toLowerCase()](
      dataFileContent,
      this.walletProvider,
      this.web3,
    );
  };

  this.supportedActions = supportedActions;

  return this;
};

// Bind all actions in the /actions to Ethlet
let actionModules = glob.sync(path.resolve(__dirname, './actions/*.js'));
let supportedActions = [];
actionModules.forEach(f => {
  const fileName = path.basename(f);
  const actionName = fileName.split('.')[0].toLowerCase();
  supportedActions.push(actionName);
  Ethlet[actionName] = require(f);
});

exports = module.exports = Ethlet;
