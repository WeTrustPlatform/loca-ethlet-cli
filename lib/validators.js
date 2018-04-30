const glob = require('glob');
const path = require('path');
const fs = require('fs');
const AJV = require('ajv');

const validators = {};

let schemas = glob.sync('./schemas/*.json');
schemas.forEach((f) => {
  const content = JSON.parse(fs.readFileSync(f, 'utf8'));
  const ajv = new AJV({allErrors: true});
  const fileName = path.basename(f);
  validators[fileName.split('.')[0]] = ajv.compile(content);
});

exports = module.exports = validators;
