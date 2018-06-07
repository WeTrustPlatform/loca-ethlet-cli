const fs = require('fs');
const path = require('path');
const TransportHID = require('@ledgerhq/hw-transport-node-hid').default;
const {
  createTransportRecorder,
  createTransportReplayer,
  RecordStore,
} = require('@ledgerhq/hw-transport-mocker');
const LedgerHID = require('../LedgerHID');
const Ethlet = require('../../../index.js');

const getSnapshotsPath = () => {
  return path.resolve(__dirname, './snapshots.json');
};

const loadSnapshots = () => {
  const p = getSnapshotsPath();
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
};

const updateSnapshots = snapshots => {
  const p = getSnapshotsPath();
  fs.writeFileSync(p, JSON.stringify(snapshots, null, 2), 'utf-8');
};

// Shared by all tests
let snapshots;
let requiredUpdateSnapshots;

// Determine the transport object for each TestId
// If dev is not happy with current snapshot, remove the data in ./snapshots.json
const getTransportForTestId = async testId => {
  let recordStore = snapshots[testId];
  let transport;
  // Check if there's valid snapshot for current testId
  if (
    recordStore &&
    recordStore.cache &&
    Object.keys(recordStore.cache).length !== 0
  ) {
    // Snapshot found. Restore the transport.
    requiredUpdateSnapshots = false;
    TransportReplayer = createTransportReplayer(
      RecordStore.fromObject(recordStore),
    );
    transport = await TransportReplayer.create();
  } else {
    // No snapshot found. Need to generate one.
    // Set high time out because deverloper has to confirm transactions on the ledger
    // Remember to enter pin and go to Ethereum app before running tests
    jest.setTimeout(10000000);

    recordStore = new RecordStore();

    // Update snapshots and flag to persist in ./snapshots.json
    // If the test fails, manually remove the testId in ./snapshots.json
    snapshots[testId] = recordStore;
    requiredUpdateSnapshots = true;

    TransportRecorder = createTransportRecorder(TransportHID, recordStore);
    transportHID = new TransportHID(LedgerHID._getDevice());
    transport = new TransportRecorder(transportHID);
  }

  return transport;
};

beforeEach(() => {
  snapshots = loadSnapshots();
});

afterEach(() => {
  if (requiredUpdateSnapshots) {
    updateSnapshots(snapshots);
  }
});

test('Get Ledger Address', async () => {
  const testId = 'Get Ledger Address';
  const transport = await getTransportForTestId(testId);

  const l = new LedgerHID({ transport });

  let address = await l.getAddress();
  console.log(address);
  expect(address).toEqual(expect.stringMatching(/^0x/));

  // Calling getAddress again will return the stored value
  // No need to confirm on ledger
  address = await l.getAddress();
  expect(address).toEqual(expect.stringMatching(/^0x/));

  await l.close();
});

test('Ledger signTransaction', async () => {
  const testId = 'Ledger signTransaction';
  const transport = await getTransportForTestId(testId);

  const l = new LedgerHID({ transport });
  const signed = await l.signTransaction({ chainId: 1 });

  await l.close();

  expect(signed).toEqual(
    expect.objectContaining({
      v: expect.any(Buffer),
      r: expect.any(Buffer),
      s: expect.any(Buffer),
    }),
  );
});

test('Send ETH using Ledger', async () => {
  const testId = 'Send ETH using Ledger';
  const transport = await getTransportForTestId(testId);

  const walletProvider = new LedgerHID({ transport });
  const ethlet = new Ethlet({
    walletProvider,
    rpc: global.__RPC__,
  });

  const to = '0x3422a28AAA5DfA0c15D69DB01333aC2de2C8C63c';
  await ethlet.execute('send', {
    chainId: 1,
    to,
    value: '1000000000000000000',
  });

  walletProvider.close();

  const balance = await ethlet.web3.eth.getBalance(to);
  expect(balance).toBe(ethlet.web3.utils.toWei('1', 'ether'));
});

test('Ledger is not connected', () => {
  expect(() => new LedgerHID()).toThrowError(
    'Cannot find Ledger. Please enter pin and go to the ETH app on the ledger.',
  );
});
