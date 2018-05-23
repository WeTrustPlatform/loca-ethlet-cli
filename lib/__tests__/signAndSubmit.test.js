const path = require('path');
const KeyStore = require('../../lib/wallet-provider/KeyStore');
const keystore = path.resolve('./data/keystore.example');
const password = path.resolve('./data/password.example');

const getId = jest.fn();
const hash = jest.fn(() => Buffer.from('abc'));
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

const walletProvider = new KeyStore({ keystore, password });

beforeEach(() => {
  getId.mockClear();
  hash.mockClear();
});

const signAndSubmit = require('../signAndSubmit');

test('Throw on wrong network', () => {
  getId.mockReturnValueOnce(Promise.resolve(2));
  return expect(
    signAndSubmit({ chainId: 1 }, walletProvider, web3),
  ).rejects.toThrowError('Signing on wrong network');
});

test('Sign successfully', () => {
  getId.mockReturnValueOnce(Promise.resolve(1));
  return expect(
    signAndSubmit({ chainId: 1 }, walletProvider, web3),
  ).resolves.toBe('sent');
});
