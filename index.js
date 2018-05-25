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

const glob = require('glob');
const path = require('path');
const fs = require('fs');
const assert = require('assert');
const Web3 = require('web3');
const validator = require('./lib/validators').locaEthletInit;
const walletProvider = require('./lib/wallet-provider');

/**
 * Main Class
 *
 */
class Ethlet {
  /**
   * @param {object} options: { walletProvider, rpc }
   */
  constructor(options) {
    if (!validator(options)) {
      throw new Error(JSON.stringify(validator.errors));
    }
    const { walletProvider, rpc } = options;
    this.web3 = new Web3(new Web3.providers.HttpProvider(rpc));
    this.walletProvider = walletProvider;
  }

  /**
   * Execute an action
   * @param {string} actionName: Name of the action i.e. deploy, interact, send
   * @param {uri | object} data: Location of data file or a data json object
   * @return {Promise} result: Result of web3.eth.sendSignedTransaction
   */
  async execute(actionName, data) {
    assert.ok(
      supportedActions[actionName],
      `Action '${actionName}' is invalid. Supported actions: ${[
        ...Object.keys(supportedActions),
      ]}`,
    );

    assert.ok(data, `Missing the location of datafile`);

    let dataFileContent;
    if (typeof data === 'string') {
      dataFileContent = JSON.parse(fs.readFileSync(data, 'utf-8'));
    } else if (typeof data === 'object') {
      dataFileContent = data;
    }

    return supportedActions[actionName](
      dataFileContent,
      this.walletProvider,
      this.web3,
    );
  }
}

// Load the wallet providers
Ethlet.WalletProvider = walletProvider;

// Get all the actions
let actionModules = glob.sync(path.resolve(__dirname, './actions/*.js'));
let supportedActions = {};
actionModules.forEach(f => {
  const fileName = path.basename(f);
  const actionName = fileName.split('.')[0].toLowerCase();
  supportedActions[actionName] = require(f);
});

exports = module.exports = Ethlet;
