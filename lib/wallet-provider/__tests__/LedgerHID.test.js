const fs = require('fs');
const path = require('path');
const TransportHID = require('@ledgerhq/hw-transport-node-hid').default;
const {
  createTransportRecorder,
  createTransportReplayer,
  RecordStore,
} = require('@ledgerhq/hw-transport-mocker');
const LedgerHID = require('../LedgerHID');

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

beforeAll(() => {
  snapshots = loadSnapshots();
});

afterAll(() => {
  if (requiredUpdateSnapshots) {
    updateSnapshots(snapshots);
  }
});

test('Get Ledger Address and Sign Message', async () => {
  const testId = 'Get Ledger Address and Sign Message';
  const transport = await getTransportForTestId(testId);

  const l = new LedgerHID({ transport });

  let address = await l.getAddress();
  console.log(address);
  expect(address).toEqual(expect.stringMatching(/^0x/));

  // Calling getAddress again will return the stored value
  // No need to confirm on ledger
  address = await l.getAddress();
  expect(address).toEqual(expect.stringMatching(/^0x/));

  const signed = await l.sign(
    'e8018504e3b292008252089428ee52a8f3d6e5d15f8b131996950d7f296c7952872bd72a2487400080',
  );
  console.log(JSON.stringify(signed));
  expect(signed).toEqual(
    expect.objectContaining({
      v: expect.any(String),
      r: expect.any(String),
      s: expect.any(String),
    }),
  );
});

test('Ledger is not connected', () => {
  expect(() => new LedgerHID()).toThrowError(
    'Cannot find Ledger. Please enter pin and go to the ETH app on the ledger.',
  );
});
