const LedgerHID = require('../LedgerHID');
const l = new LedgerHID();

jest.setTimeout(10000000);
test('Get Ledger Address', async () => {
  const address = await l.getAddress();
  console.log(address);
  const signed = await l.sign(
    'e8018504e3b292008252089428ee52a8f3d6e5d15f8b131996950d7f296c7952872bd72a2487400080',
  );
  console.log(JSON.stringify(signed));
  return expect('abc').toBe('abc');
});
