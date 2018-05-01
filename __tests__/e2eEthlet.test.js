const LocaEthlet = require('../index');
const {port: rpcPort, server} = require('../setupTest');
const path = require('path');

beforeAll(() => console.log('Jest sets up testrpc'));
afterAll(() => {
  console.log('Jest tears down');
  server.close();
});

const createEthlet = () => {
  return new LocaEthlet({
    keystore: path.resolve('./data/keystore.example'),
    password: path.resolve('./data/password.example'),
    rpc: `http://localhost:${rpcPort}`,
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
  const result = await ethlet.execute('deploy', path.resolve('./__tests__/deploy.json'));
  expect(result.contractAddress).toBe('0x1Cd41489Ab95997A86FFdE793f93c55388A6d6Fa');
});

// This test interacts with the contract deployed in the previous test
test('Test LocaEthlet Interact Successful', async () => {
  const ethlet = createEthlet();
  const result = await ethlet.execute('interact', path.resolve('./__tests__/interact.json'));
});
