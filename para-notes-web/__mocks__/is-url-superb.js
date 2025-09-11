module.exports = jest.fn((string, options = {}) => {
  // Simple URL validation for testing
  try {
    new URL(string)
    return true
  } catch {
    return false
  }
})
