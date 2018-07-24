[![Build Status](https://travis-ci.org/WeTrustPlatform/loca-ethlet-cli.svg?branch=master)](https://travis-ci.org/WeTrustPlatform/loca-ethlet-cli)
[![Coverage Status](https://coveralls.io/repos/github/WeTrustPlatform/loca-ethlet-cli/badge.svg?branch=master)](https://coveralls.io/github/WeTrustPlatform/loca-ethlet-cli?branch=master)

# loca-ethlet-cli

Local Ethereum Wallet for Crazy People


## Installation

- If you don't have `yarn`, I recommend you give it a try https://yarnpkg.com/lang/en/
```
yarn global add loca-ethlet-cli --prefix /usr/local
```

## Usage

This tool can be used in two ways: (1) As a command line or (2) As a node_module

#### As command line interface:

```
loca-ethlet --help

usage: loca-ethlet [-h] [-v] -a  -k  -p  -d  -r

Interact/deploy Smart Contracts and transfer ETH/Tokens via RPC

Optional arguments:
  -h, --help        Show this help message and exit.
  -v, --version     Show program's version number and exit.
  -a , --action     Action name i.e deploy, interact or send
  -k , --keystore   Location of the keystore json file
  -p , --password   Location of the password file to unlock keystore
  -d , --datafile   Location of the datafile
  -r , --rpc        URL of the Ethereum node's RPC server

    Copyright (C) 2018 WeTrustPlatform

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/gpl-3.0.txt>.
```

List of [arguments](https://github.com/WeTrustPlatform/loca-ethlet-cli/blob/master/bin/index.js).


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

## Troubleshooting
- Issue `error Cannot create "/usr/local/bin/loca-ethlet" due to insufficient permissions.`
  - Install as root `sudo yarn global add loca-ethlet-cli --prefix /usr/local`
- Issue `Error: Cannot find module 'babel-runtime/core-js/get-iterator'`
  - Known issue https://github.com/WeTrustPlatform/loca-ethlet-cli/issues/8


## To Be Improved in a Near Future
- Even though the datafile flag supports all the complex use cases, it's a hassle for simple day-to-day use such as transferring ERC20 tokens. Introducing a new flag, let's say template, which only requires users to input smart contract address, method's name, and parameters.  The ABI can be fetched on etherscan.

- GUI tools (in-progress).

- Sign transactions with hardware wallet (in-progress).


## License
[GPL-3.0](https://github.com/WeTrustPlatform/loca-ethlet-cli/blob/master/LICENSE) &copy; WeTrustPlatform
