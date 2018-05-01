const fs = require('fs');

exports = module.exports = function getCredential(
  keyStoreLoc,
  passwordLoc,
  web3) {
  const keystoreContent = JSON.parse(fs.readFileSync(keyStoreLoc, 'utf8'));
  const password = fs.readFileSync(passwordLoc, 'utf8').trim();
  return web3.eth.accounts.decrypt(keystoreContent, password);
};
