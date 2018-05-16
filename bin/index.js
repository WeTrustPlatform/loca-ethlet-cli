#! /usr/bin/env node
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


/**
 * Usage: loca-ethlet -h
 */

const ArgumentParser = require('argparse').ArgumentParser;
const parser = new ArgumentParser({
  version: require('../package.json').version,
  addHelp: true,
  epilog: `Copyright (C) 2018 WeTrustPlatform
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
  `,
  description:
    'Interact/deploy Smart Contracts and transfer ETH/Tokens via RPC',
});

parser.addArgument(['-a', '--action'], {
  help: 'action name i.e deploy or interact',
  required: true,
});

parser.addArgument(['-k', '--keystore'], {
  help: 'location of the keystore json file',
  required: true,
});

parser.addArgument(['-p', '--password'], {
  help: 'location of the password file to unlock keystore',
  required: true,
});

parser.addArgument(['-d', '--datafile'], {
  help: 'location of the datafile',
  required: true,
});

parser.addArgument(['-r', '--rpc'], {
  help: 'rpc url',
  required: true,
});

const args = parser.parseArgs();

console.log(`Args: ${JSON.stringify(args)}`);

const LocaEthlet = require('../index');

const main = async function main() {
  const { keystore, password, rpc, action, datafile } = args;
  const ethlet = new LocaEthlet({ keystore, password, rpc });
  return await ethlet.execute(action, datafile);
};

main();
