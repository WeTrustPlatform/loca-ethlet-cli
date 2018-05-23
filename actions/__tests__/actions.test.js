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

const web3 = {
  eth: {
    Contract: jest.fn(() => ({
      deploy: jest.fn(() => ({
        encodeABI: jest.fn(),
      })),
      methods: {
        a: jest.fn(() => ({
          encodeABI: jest.fn(),
        })),
      },
    })),
  },
  utils: {
    toHex: jest.fn(),
  },
};

const walletProvider = {
  getAddress: jest.fn(),
  sign: jest.fn(),
};

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
    abi: [{ name: 'a' }],
    contractAddress: 'a',
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
