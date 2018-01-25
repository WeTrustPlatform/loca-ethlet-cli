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
  ['-a', '--address'],
  { help: 'address of the contract deploy'}
);
const Web3 = require('web3');
