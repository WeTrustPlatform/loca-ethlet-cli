const validator = require('../lib/validators').interact;
const signAndSubmit = require('../lib/signAndSubmit');

exports = module.exports = async function interact(
  dataFileContent,
  credential,
  web3) {
  if (!validator(dataFileContent)) {
    throw new Error(JSON.stringify(validator.errors));
  }

  const {
    contractAddress,
    abi,
    chainId,
    gasPrice,
    gasLimit,
    methodName,
    value,
    parameters = [],
  } = dataFileContent;

  const contractInstance = new web3.eth.Contract(abi, contractAddress);
  const data = contractInstance.methods[methodName](...parameters).encodeABI();

  return signAndSubmit(
    {
      to: contractAddress,
      data,
      value,
      chainId,
      gasLimit,
      gasPrice,
    },
    credential,
    web3
  );
};
