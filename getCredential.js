exports = module.exports = function getCredential(keyStoreLoc, passwordLoc, decryptFn) {
  const keystoreContent = JSON.parse(fs.readFileSync(keyStoreLoc, 'utf8'));
  const password = fs.readFileSync(passwordLoc, 'utf8').trim();
  return decryptFn(keystoreContent, password); 
}
