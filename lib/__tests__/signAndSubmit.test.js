jest.mock('ethereumjs-tx');
const mockEthTx = require('ethereumjs-tx');

mockEthTx.mockImplementation(() => {
  return {
    sign: jest.fn(),
    serialize: () => 'abc',
  };
});
const getId = jest.fn();

const web3 = {
  eth: {
    getTransactionCount: jest.fn(),
    sendSignedTransaction: () => Promise.resolve('sent'),
    net: {
      getId,
    },
  },
  utils: {
    toHex: jest.fn(),
    toWei: jest.fn(),
  },
};

beforeEach(() => {
  getId.mockClear();
});

const signAndSubmit = require('../signAndSubmit');

test('Throw on wrong network', () => {
  getId.mockReturnValueOnce(Promise.resolve(2));
  return expect(signAndSubmit({chainId: 1}, {}, web3))
      .rejects.toThrowError('Signing on wrong network');
});

test('Sign successfully', () => {
  getId.mockReturnValueOnce(Promise.resolve(1));
  const privateKey = 'abc';
  const address = 'abc';
  return expect(signAndSubmit({chainId: 1}, {privateKey, address}, web3))
      .resolves.toBe('sent');
});
