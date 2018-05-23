const signAndSubmit = require('../lib/signAndSubmit');
const validator = require('../lib/validators').send;

exports = module.exports = async function send(
  dataFileContent,
  walletProvider,
  web3,
) {
  if (!validator(dataFileContent)) {
    throw new Error(JSON.stringify(validator.errors));
  }

  const { chainId, value, gasPrice, gasLimit, to, data } = dataFileContent;

  return signAndSubmit(
    {
      to,
      value,
      chainId,
      data: web3.utils.toHex(data),
      gasLimit,
      gasPrice,
    },
    walletProvider,
    web3,
  );
};
