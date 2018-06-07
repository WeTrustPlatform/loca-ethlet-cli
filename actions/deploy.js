const validator = require('../lib/validators').deploy;
const signAndSubmit = require('../lib/signAndSubmit');
const { prepend0x } = require('../lib/util');

/**
 * Deploy a smart contract
 * @param {object} deployParams
 * @param {WalletProvider} walletProvider
 * @param {Web3} web3
 * @return {Promise}
 */
exports = module.exports = async function deploy(
  deployParams,
  walletProvider,
  web3,
) {
  if (!validator(deployParams)) {
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
  } = deployParams;

  const bytecode = prepend0x(rawBytecode);

  const contract = new web3.eth.Contract(abi);
  const data = contract
    .deploy({
      data: bytecode,
      arguments: parameters,
    })
    .encodeABI();

  const deployResult = await signAndSubmit(
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

  return deployResult;
};
