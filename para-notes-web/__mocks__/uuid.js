module.exports = {
  v4: jest.fn(() => 'mock-uuid-1234'),
  v1: jest.fn(() => 'mock-uuid-5678'),
  validate: jest.fn(() => true),
  version: jest.fn(() => 4),
  NIL: '00000000-0000-0000-0000-000000000000',
  MAX: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
}
