/**
 * Usage: node index.js -h
 */

const path = require('path');
const glob = require('glob');
const parser = require('./lib/argsParser');
const args = parser.parseArgs();

console.log(`Args: ${JSON.stringify(args)}`);

const actions = {};
let actionModules = glob.sync('./actions/*.js');
actionModules.forEach((f) => {
  const fileName = path.basename(f);
  actions[fileName.split('.')[0]] = require(f);
});

actions[args.action](args);

