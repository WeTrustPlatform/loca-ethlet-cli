#! /usr/bin/env node
/**
 * Usage: loca-ethlet -h
 */

const ArgumentParser = require('argparse').ArgumentParser;
const parser = new ArgumentParser({
  version: require('../package.json').version,
  addHelp: true,
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
