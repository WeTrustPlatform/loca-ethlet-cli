const validator = require('../lib/validators').deploy;
const signAndSubmit = require('../lib/signAndSubmit');

exports = module.exports = async function deploy(
  dataFileContent,
  credential,
  web3) {
  if (!validator(dataFileContent)) {
    throw new Error(JSON.stringify(validator.errors));
  }

  const {
    chainId,
    bytecode: rawBytecode,
    abi,
    gasPrice,
    gasLimit,
    parameters = [],
  } = dataFileContent;

  const bytecode =
      rawBytecode.startsWith('0x') ? rawBytecode : `0x${rawBytecode}`;

  const contract = new web3.eth.Contract(abi);
  const data = contract.deploy({
    data: bytecode,
    arguments: parameters,
    }).encodeABI();

  return signAndSubmit(
  {
    data,
    value,
    chainId,
    gasLimit,
    gasPrice,
  },
  credential,
  web3);
};
