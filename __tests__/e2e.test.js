const LocaEthlet = require('../index');
const {server} = require('../setupTest');
const path = require('path');

const keystore = path.resolve('./data/keystore.example');
const password = path.resolve('./data/password.example');
const deployData = path.resolve('./__tests__/deploy.json');
const interactData = path.resolve('./__tests__/interact.json');
const rpc = `http://localhost:${server.address().port}`;

beforeAll(() => console.log(`Jest sets up testrpc at ${rpc}`));
afterAll(() => {
  console.log('Jest tears down');
  server.close();
});

const createEthlet = () => {
  return new LocaEthlet({
    keystore,
    password,
    rpc,
  });
};

test('Test Init LocaEthlet Return Credential', () => {
  const ethlet = createEthlet();
  expect(ethlet.credential.address)
      .toBe('0xd69d3EF6B055D4Dbd04D83525f2968b875A8366b');
});

test('Test Init LocaEthlet Return Web3 Instance', () => {
  const ethlet = createEthlet();
  expect(ethlet).toHaveProperty('web3');
  expect(ethlet.web3.eth.net.getId()).resolves.toBe(1);
});

test('Test LocaEthlet Execute Throws', async () => {
  const ethlet = createEthlet();
  expect(ethlet).toHaveProperty('execute');
  await expect(ethlet.execute()).rejects.toThrow();
});

test('Test LocaEthlet Deploy Successful', async () => {
  const ethlet = createEthlet();
  const result = await ethlet.execute('deploy', deployData);
  // Verify the address of the deployed contract
  expect(result.contractAddress).toBe('0x1Cd41489Ab95997A86FFdE793f93c55388A6d6Fa');
});

// This test interacts with the contract deployed in the previous test
test('Test LocaEthlet Interact Successful', async () => {
  const ethlet = createEthlet();
  const result = await ethlet.execute('interact', interactData);
  expect(result.blockHash).toBeTruthy();
});

test('Test CLI Deploy', async () => {
  const util = require('util');
  const exec = require('child_process').exec;
  const cmd = `node bin/index.js -a deploy -p ${password} -k ${keystore} -d ${deployData} -r ${rpc}`;
  console.log(`CLI cmd: ${cmd}`);
  const {stdout, stderr} = await util.promisify(exec)(cmd);
  expect(stderr).toBeFalsy();
  // Check if the stdout has the address of the second deployed contract
  expect(JSON.stringify(stdout)).toMatch(/0x49b7F165b55911896CE7F5d82786120F1A34B50E/);
});
