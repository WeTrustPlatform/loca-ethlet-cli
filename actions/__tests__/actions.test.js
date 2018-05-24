const Web3 = require('web3');
const path = require('path');
const KeyStore = require('../../lib/wallet-provider/KeyStore');
const keystore = path.resolve('./data/keystore.example');
const password = path.resolve('./data/password.example');

const mockSignAndSubmit = Promise.resolve('signed n submitted');
require('../../lib/signAndSubmit');
jest.mock('../../lib/signAndSubmit', () => {
  return jest.fn().mockImplementation(() => mockSignAndSubmit);
});

const deploy = require('../deploy');
const interact = require('../interact');
const send = require('../send');

const {
  deploy: deployValidator,
  interact: interactValidator,
  send: sendValidator,
} = require('../../lib/validators');

const web3 = new Web3();

const walletProvider = new KeyStore({ keystore, password });

test('Deploy validation error', () => {
  deployValidator({});
  return expect(deploy()).rejects.toThrowError(
    JSON.stringify(deployValidator.errors),
  );
});

test('Deploy success', () => {
  const dataFileContent = {
    chainId: 1,
    bytecode: 'abc',
    abi: [{ a: 1 }],
  };
  return expect(deploy(dataFileContent, walletProvider, web3)).resolves.toBe(
    'signed n submitted',
  );
});

test('Interact validation error', () => {
  interactValidator({});
  return expect(interact()).rejects.toThrowError(
    JSON.stringify(interactValidator.errors),
  );
});

test('Interact success', () => {
  const dataFileContent = {
    chainId: 1,
    abi: [
      {
        inputs: [],
        name: 'a',
        type: 'function',
      },
    ],
    contractAddress: '0x1Cd41489Ab95997A86FFdE793f93c55388A6d6Fa',
    methodName: 'a',
  };
  return expect(interact(dataFileContent, walletProvider, web3)).resolves.toBe(
    'signed n submitted',
  );
});

test('Send validation error', () => {
  sendValidator({});
  return expect(send()).rejects.toThrowError(
    JSON.stringify(sendValidator.errors),
  );
});

test('Send success', () => {
  const dataFileContent = {
    chainId: 1,
    to: '123',
    value: '123',
  };
  return expect(send(dataFileContent, walletProvider, web3)).resolves.toBe(
    'signed n submitted',
  );
});
