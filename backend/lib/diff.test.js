const { computeDiff } = require('./diff');

describe('computeDiff', () => {
  test('detects added and removed words', () => {
    const result = computeDiff('old text here', 'new text lives here');
    expect(result.addedWords).toContain('new');
    expect(result.removedWords).toContain('old');
    expect(result.oldLength).toBe(13);
    expect(result.newLength).toBe(20);
  });

  test('treats punctuation as separators', () => {
    const result = computeDiff('alpha, beta', 'alpha beta gamma');
    expect(result.addedWords).toEqual(['gamma']);
    expect(result.removedWords).toEqual([]);
  });

  test('handles case insensitivity', () => {
    const result = computeDiff('Hello World', 'hello world again');
    expect(result.addedWords).toEqual(['again']);
    expect(result.removedWords).toEqual([]);
  });

  test('deduplicates repeated word changes', () => {
    const result = computeDiff('foo foo bar', 'foo bar bar bar');
    expect(result.addedWords).toEqual(['bar']);
    expect(result.removedWords).toEqual(['foo']);
  });

  test('empty new content reports removals', () => {
    const result = computeDiff('some text here', '');
    expect(result.addedWords).toEqual([]);
    expect(result.removedWords.sort()).toEqual(['here', 'some', 'text']);
  });
});
