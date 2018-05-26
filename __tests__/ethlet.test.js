const path = require('path');
const LocaEthlet = require('../index');
const keystore = path.resolve('./data/keystore.example');
const password = path.resolve('./data/password.example');

const createEthlet = () => {
  const walletProvider = new LocaEthlet.WalletProvider.KeyStore({
    keystore,
    password,
  });
  return new LocaEthlet({
    walletProvider,
    rpc: global.__RPC__,
  });
};

test('Test LocaEthlet Execute Throws Invalid Action', async () => {
  // expect 2 assertions were called
  expect.assertions(2);

  const ethlet = createEthlet();
  expect(ethlet).toHaveProperty('execute');
  try {
    await ethlet.execute('wrongAction');
  } catch (e) {
    return expect(e.message).toMatch(
      "Action 'wrongAction' is invalid. Supported actions: deploy,interact,send",
    );
  }
});

test('Test LocaEthlet Execute Throws Wrong Data Type', async () => {
  expect.assertions(1);
  const ethlet = createEthlet();
  try {
    await ethlet.execute('deploy', () => {});
  } catch (e) {
    return expect(e.message).toBe('Expect data to be typeof string or object');
  }
});
