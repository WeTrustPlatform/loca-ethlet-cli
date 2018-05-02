const mockSignAndSubmit = Promise.resolve('signed n submitted');
require('../../lib/signAndSubmit');
jest.mock('../../lib/signAndSubmit', () => {
  return jest.fn().mockImplementation(() => mockSignAndSubmit);
});

const deploy = require('../deploy');
const validator = require('../../lib/validators').deploy;

const web3 = {
  eth: {
    Contract: jest.fn(() => ({
      deploy: jest.fn(() => ({
        encodeABI: jest.fn(),
      })),
    })),
  },
};

test('Deploy validation error', () => {
  validator({});
  return expect(deploy()).rejects.toThrowError(JSON.stringify(validator.errors));
});

test('Deploy success', () => {
  const dataFileContent = {
    chainId: 1,
    bytecode: 'abc',
    abi: [{a: 1}],
  };
  return expect(deploy(dataFileContent, {}, web3)).resolves.toBe('signed n submitted');
});
