const granche = require('ganache-cli');
const server = granche.server({
  network_id: 1,
  accounts: [
    {
      secretKey: '0x275ef35f55525049678090f9e32d16cbcca06f07dc4f51e297ed39a47d901981',
      balance: '0x4563918244f40000',
    },
  ],
});

server.listen((err, blockchain) => {
  if (err) throw err;

  const port = server.address().port;
  console.log(`Testrpc is running at port: ${port}`);
});

exports = module.exports = {
  server,
};
