/**
 * Prepend 0x to string only if it does not start with 0x
 * @param {string} s
 * @return {string}
 */
const prepend0x = s => (s.startsWith('0x') ? s : `0x${s}`);

/**
 * Remove 0x from string only if it starts with 0x
 * @param {string} s
 * @return {string}
 */
const remove0x = s => (s.startsWith('0x') ? s.slice(2) : s);

exports = module.exports = {
  prepend0x,
  remove0x,
};
