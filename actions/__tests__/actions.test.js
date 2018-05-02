const mockSignAndSubmit = Promise.resolve('signed n submitted');
require('../../lib/signAndSubmit');
jest.mock('../../lib/signAndSubmit', () => {
  return jest.fn().mockImplementation(() => mockSignAndSubmit);
});

const deploy = require('../deploy');
const interact = require('../interact');

const {deploy: deployValidator, interact: interactValidator} =
  require('../../lib/validators');

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
};

test('Deploy validation error', () => {
  deployValidator({});
  return expect(deploy()).rejects.toThrowError(JSON.stringify(deployValidator.errors));
});

test('Deploy success', () => {
  const dataFileContent = {
    chainId: 1,
    bytecode: 'abc',
    abi: [{a: 1}],
  };
  return expect(deploy(dataFileContent, {}, web3)).resolves.toBe('signed n submitted');
});

test('Interact validation error', () => {
  interactValidator({});
  return expect(interact()).rejects.toThrowError(JSON.stringify(interactValidator.errors));
});

test('Interact success', () => {
  const dataFileContent = {
    chainId: 1,
    abi: [{name: 'a'}],
    contractAddress: 'a',
    methodName: 'a',
  };
  return expect(interact(dataFileContent, {}, web3)).resolves.toBe('signed n submitted');
});
