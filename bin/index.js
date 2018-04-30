#! /usr/bin/env node
/**
 * Usage: ethlet -h
 */

const parser = require('../lib/argsParser');
const args = parser.parseArgs();

console.log(`Args: ${JSON.stringify(args)}`);

const Ethlet = require('../index');
new Ethlet(args).execute();
