const LocaEthlet = require('../index');
const rpcPort = require('../setupTest').port;
const path = require('path');

const createEthlet = () => {
  return new LocaEthlet({
    keystore: path.resolve('./data/keystore.example'),
    password: path.resolve('./data/password.example'),
    rpc: `http://localhost:${rpcPort}`,
  });
};

test('Test Init LocaEthlet', () => {
  const ethlet = createEthlet();
  expect(ethlet.credential.address)
      .toBe('0xd69d3EF6B055D4Dbd04D83525f2968b875A8366b');
});

test('Test LocaEthlet Execute Throws', async () => {
  const ethlet = createEthlet();
  await expect(ethlet.execute()).rejects.toThrow();
});
