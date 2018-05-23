const validator = require('../lib/validators').deploy;
const signAndSubmit = require('../lib/signAndSubmit');
const { prepend0x } = require('../lib/util');

exports = module.exports = async function deploy(
  dataFileContent,
  walletProvider,
  web3,
) {
  if (!validator(dataFileContent)) {
    throw new Error(JSON.stringify(validator.errors));
  }

  const {
    chainId,
    bytecode: rawBytecode,
    abi,
    value,
    gasPrice,
    gasLimit,
    parameters = [],
  } = dataFileContent;

  const bytecode = prepend0x(rawBytecode);

  const contract = new web3.eth.Contract(abi);
  const data = contract
    .deploy({
      data: bytecode,
      arguments: parameters,
    })
    .encodeABI();

  return signAndSubmit(
    {
      data,
      value,
      chainId,
      gasLimit,
      gasPrice,
    },
    walletProvider,
    web3,
  );
};
