const path = require('path');
const LocaEthlet = require('../index');
const keystore = path.resolve('./data/keystore.example');
const password = path.resolve('./data/password.example');
const deployData = path.resolve('./__tests__/deploy.json');
const interactData = path.resolve('./__tests__/interact.json');
const sendData = path.resolve('./__tests__/send.json');
const rpc = global.__RPC__;

const createEthlet = () => {
  const walletProvider = new LocaEthlet.WalletProvider.KeyStore({
    keystore,
    password,
  });
  return new LocaEthlet({
    walletProvider,
    rpc,
  });
};

test('Test Init LocaEthlet Return Web3 Instance', async () => {
  const ethlet = createEthlet();
  expect(ethlet).toHaveProperty('web3');
  await expect(ethlet.web3.eth.net.getId()).resolves.toBe(1);
});

test('Test LocaEthlet Deploy Successful', async () => {
  const ethlet = createEthlet();
  const result = await ethlet.execute('deploy', deployData);
  // Verify the address of the deployed contract
  expect(result.contractAddress).toBe(
    '0x1Cd41489Ab95997A86FFdE793f93c55388A6d6Fa',
  );
});

// This test interacts with the contract deployed in the previous test
test('Test LocaEthlet Interact Successful', async () => {
  const ethlet = createEthlet();
  const result = await ethlet.execute('interact', interactData);
  expect(result.blockHash).toBeTruthy();
});

// This test sends ETH to the contract deployed in the previous test
test('Test LocaEthlet Send Successful', async () => {
  const ethlet = createEthlet();
  const result = await ethlet.execute('send', sendData);
  expect(result.blockHash).toBeTruthy();
  const balance = await ethlet.web3.eth.getBalance(
    '0x1Cd41489Ab95997A86FFdE793f93c55388A6d6Fa',
  );
  return expect(balance).toBe(ethlet.web3.utils.toWei('1', 'ether')); // same value in send.json
});

// The deployed contract address is deterministic based on the account's nonce
// Hence this test will fail if you add additional tests to run before this test
test('Test CLI Deploy', async () => {
  const util = require('util');
  const exec = require('child_process').exec;
  const cmd = `node bin/index.js -a deploy -p ${password} -k ${keystore} -d ${deployData} -r ${rpc}`;
  console.log(`CLI cmd: ${cmd}`);
  const { stdout, stderr } = await util.promisify(exec)(cmd);
  expect(stderr).toBeFalsy();
  // Check if the stdout has the address of the second deployed contract
  expect(JSON.stringify(stdout)).toMatch(
    /0xc33CE374F63e1D2255Ce51bdc0916FDe21e5C8aa/,
  );
});
