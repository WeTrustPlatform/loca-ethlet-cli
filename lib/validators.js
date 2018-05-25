const glob = require('glob');
const path = require('path');
const fs = require('fs');
const AJV = require('ajv');

const validators = {};

// Load all the schemas in schemas/ folder
let schemas = glob.sync(path.resolve(__dirname, '../schemas/*.json'));
schemas.forEach(f => {
  const content = JSON.parse(fs.readFileSync(f, 'utf8'));
  const ajv = new AJV({ allErrors: true });
  const fileName = path.basename(f);
  validators[fileName.split('.')[0]] = ajv.compile(content);
});

/**
 * Validators json
 * {
 *   key: 'name of the schema file without extension',
 *   value: 'AJV compiled object'
 * }
 *
 */
exports = module.exports = validators;
