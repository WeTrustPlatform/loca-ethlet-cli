const path = require('path');
const glob = require('glob');
const validator = require('./lib/validators').cli;

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

  this.options = options;
  this.action = actions[options.action];

  this.execute = () => {
    this.action(this.options);
  };

  return this;
};
exports = module.exports = Ethlet;
