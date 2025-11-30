const NON_WORD_REGEX = /[^a-z0-9'\s]/gi;

function tokenize(text = '') {
  return text
    .toLowerCase()
    .replace(NON_WORD_REGEX, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function countWords(tokens) {
  return tokens.reduce((counts, token) => {
    counts[token] = (counts[token] || 0) + 1;
    return counts;
  }, {});
}

function computeDiff(oldText = '', newText = '') {
  const oldTokens = tokenize(oldText);
  const newTokens = tokenize(newText);
  const oldCounts = countWords(oldTokens);
  const newCounts = countWords(newTokens);

  const addedWords = Array.from(
    new Set(
      Object.keys(newCounts).filter(
        (word) => (newCounts[word] || 0) > (oldCounts[word] || 0)
      )
    )
  );

  const removedWords = Array.from(
    new Set(
      Object.keys(oldCounts).filter(
        (word) => (oldCounts[word] || 0) > (newCounts[word] || 0)
      )
    )
  );

  return {
    addedWords,
    removedWords,
    oldLength: oldText.length, // character counts keep parity with assignment examples
    newLength: newText.length,
  };
}

module.exports = {
  computeDiff,
  tokenize,
};
