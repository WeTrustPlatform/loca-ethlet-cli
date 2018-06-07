const { prepend0x, remove0x } = require('../util');

test('prepend0x', () => {
  expect(prepend0x('0x1')).toBe('0x1');
  expect(prepend0x('1')).toBe('0x1');
});

test('remove0x', () => {
  expect(remove0x('0x1')).toBe('1');
  expect(remove0x('1')).toBe('1');
});
