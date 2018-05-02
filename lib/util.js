const prepend0x = (s) => s.startsWith('0x') ? s : `0x${s}`;
const remove0x = (s) => s.startsWith('0x') ? s.slice(2) : s;

exports = module.exports = {
  prepend0x,
  remove0x,
};
