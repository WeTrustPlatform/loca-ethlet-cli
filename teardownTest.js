exports = module.exports = async () => {
  const server = global.__SERVER__;
  console.log(`Jest teardown testrpc at port: ${server.address().port}`);
  server.close();
};
