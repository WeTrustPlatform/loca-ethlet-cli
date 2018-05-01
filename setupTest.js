const granche = require('ganache-cli');
const server = granche.server({
  id: 1,
  accounts: [
    {
      secretKey: '0x275ef35f55525049678090f9e32d16cbcca06f07dc4f51e297ed39a47d901981',
      balance: '0x4563918244f40000',
    },
  ],
});

const port = 8547;
server.listen(port, (err, blockchain) => {
  if (err) throw err;

  console.log(`Testrpc is running at port: ${port}`);
});

beforeAll(() => console.log('Jest sets up testrpc'));
afterAll(() => {
  console.log('Jest tears down');
  server.close();
});
exports = module.exports = {
  server,
  port,
};
