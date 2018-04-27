const ArgumentParser = require('argparse').ArgumentParser;
const parser = new ArgumentParser({
  version : '0.0.1',
  addHelp : true,
  description : 'Smart Contract Deployment Script'
});

parser.addArgument([ '-k', '--keystore' ], {
  help : 'location of the keystore json file',
  required : true,
});

parser.addArgument([ '-p', '--password' ], {
  help : 'location of the password file to unlock keystore',
  required : true,
});

parser.addArgument([ '-d', '--datafile' ],
                   {help : 'location of the datafile', required : true});

parser.addArgument([ '-r', '--rpc' ], {help : 'rpc url', required : true});

exports = module.exports = parser;
