const validator = require('../lib/validators').interact;
const signAndSubmit = require('../lib/signAndSubmit');

/**
 * Interact with a smart contract
 * @param {object} interactParams
 * @param {WalletProvider} walletProvider
 * @param {Web3} web3
 * @return {Promise}
 */
exports = module.exports = async function interact(
  interactParams,
  walletProvider,
  web3,
) {
  if (!validator(interactParams)) {
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
  } = interactParams;

  const contractInstance = new web3.eth.Contract(abi, contractAddress);
  const data = contractInstance.methods[methodName](...parameters).encodeABI();

  const interactResult = await signAndSubmit(
    {
      to: contractAddress,
      data,
      value,
      chainId,
      gasLimit,
      gasPrice,
    },
    walletProvider,
    web3,
  );

  return interactResult;
};
