const LedgerU2F = require('../LedgerU2F');
const l = new LedgerU2F();

test('Get Ledger Address', async () => {
  const address = await l.getAddress();
  return expect(address).toBe('abc');
});
