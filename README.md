[![Build Status](https://travis-ci.org/WeTrustPlatform/loca-ethlet-cli.svg?branch=master)](https://travis-ci.org/WeTrustPlatform/loca-ethlet-cli)
[![Coverage Status](https://coveralls.io/repos/github/WeTrustPlatform/loca-ethlet-cli/badge.svg?branch=master)](https://coveralls.io/github/WeTrustPlatform/loca-ethlet-cli?branch=master)

# loca-ethlet-cli

Local Ethereum Wallet for Crazy People


## Installation

```
npm install -g loca-ethlet-cli
```


## Usage

This tool can be used in two ways: (1) As a command line or (2) As a node_module

#### As command line interface:

```
loca-ethlet --help
```

List of [arguments](https://github.com/WeTrustPlatform/loca-ethlet-cli/blob/master/bin/index.js):
```javascript
const ArgumentParser = require('argparse').ArgumentParser;
const parser = new ArgumentParser({
  version: require('../package.json').version,
  addHelp: true,
  description:
    'Interact/deploy Smart Contracts and transfer ETH/Tokens via RPC',
});

parser.addArgument(['-a', '--action'], {
  help: 'Action name i.e deploy, interact or send',
  required: true,
});

parser.addArgument(['-k', '--keystore'], {
  help: 'Location of the keystore json file',
  required: true,
});

parser.addArgument(['-p', '--password'], {
  help: 'Location of the password file to unlock keystore',
  required: true,
});

parser.addArgument(['-d', '--datafile'], {
  help: 'Location of the datafile',
  required: true,
});

parser.addArgument(['-r', '--rpc'], {
  help: 'URL of the Ethereum node\'s RPC server',
  required: true,
});
```


#### As node_module:

```javascript
const LocaEthlet = require('loca-ethlet-cli');

// get the wallet provider
// implementations can be found in ./lib/wallet-provider
const { KeyStore } = LocaEthlet.WalletProvider;

const keyStoreOptions = {
  keystore, // location of the keystore json file
  password, // location of the password file
};

const walletProvider = new KeyStore(keyStoreOptions);

// initialize LocaEthlet
const ethlet = new LocaEthlet({
  walletProvider,
  rpc, // URL of the Ethereum node's RPC server
});

const deployData = ; // location of the data file or a data json object
const result = await ethlet.execute('deploy', deployData);
console.log(result.contractAddress);
```


## Schemas
Datafile's schema for each action:
- [deploy](https://github.com/WeTrustPlatform/loca-ethlet-cli/blob/master/schemas/deploy.json)
- [interact](https://github.com/WeTrustPlatform/loca-ethlet-cli/blob/master/schemas/interact.json)
- [send](https://github.com/WeTrustPlatform/loca-ethlet-cli/blob/master/schemas/send.json)
- (to be added)


## Examples
List of [the example datafiles.](https://github.com/WeTrustPlatform/loca-ethlet-cli/tree/master/data)

**Caveat:** Before you use any of the example files, please double triple check the parameters to make sure you're not accidentally sending TRST to my address :)

```
loca-ethlet -d transferTRST.json.example -k keystore.example -p password.example -a interact -r https://mainnet.infura.io/{your_infura_token}
```

## To Be Improved in a Near Future
- Even though the datafile flag supports all the complex use cases, it's a hassle for simple day-to-day use such as transferring ERC20 tokens. Introducing a new flag, let's say template, which only requires users to input smart contract address, method's name, and parameters.  The ABI can be fetched on etherscan.

- GUI tools (in-progress).

- Sign transactions with hardware wallet (in-progress).


## License
[GPL-3.0](https://github.com/WeTrustPlatform/loca-ethlet-cli/blob/master/LICENSE) &copy; WeTrustPlatform
