const path = require('path');
const glob = require('glob');

const actions = {};
let actionModules = glob.sync('./actions/*.js');
actionModules.forEach((f) => {
  const fileName = path.basename(f);
  actions[fileName.split('.')[0]] = require(f);
});

exports = module.exports = actions;
