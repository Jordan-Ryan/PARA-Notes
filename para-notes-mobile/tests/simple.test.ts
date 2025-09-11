// Simple test to verify Jest is working
describe('Basic Test', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle strings', () => {
    const greeting = 'Hello, World!';
    expect(greeting).toContain('World');
  });

  it('should handle arrays', () => {
    const numbers = [1, 2, 3, 4, 5];
    expect(numbers).toHaveLength(5);
    expect(numbers).toContain(3);
  });
});
