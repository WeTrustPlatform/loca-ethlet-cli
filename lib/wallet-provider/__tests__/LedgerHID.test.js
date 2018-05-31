const LedgerHID = require('../LedgerHID');
const l = new LedgerHID();

// This test is for manual interaction with ledger
test.skip('Get Ledger Address', async () => {
  jest.setTimeout(10000000);
  const address = await l.getAddress();
  console.log(address);
  const signed = await l.sign(
    'e8018504e3b292008252089428ee52a8f3d6e5d15f8b131996950d7f296c7952872bd72a2487400080',
  );
  console.log(JSON.stringify(signed));
  return expect('abc').toBe('abc');
});
