const granche = require('granche-cli');
const server = granche.server({
  id: 1,
  accounts: [
    {
      secretKey: '0x275ef35f55525049678090f9e32d16cbcca06f07dc4f51e297ed39a47d901981',
      balance: '0x4563918244f40000',
    },
  ],
});

server.listen(8547, (err, blockchain) => {

});
