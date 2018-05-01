#! /usr/bin/env node
/**
 * Usage: loca-ethlet -h
 */

const parser = require('../lib/argsParser');
const args = parser.parseArgs();

console.log(`Args: ${JSON.stringify(args)}`);

const LocaEthlet = require('../index');
const {keystore, password, rpc, action, datafile} = args;
new LocaEthlet({keystore, password, rpc}).execute(action, datafile);
