export const cosineSimilarity = (textA, textB) => {
    
  const wordsA = textA.toLowerCase().split(/\W+/);
  const wordsB = textB.toLowerCase().split(/\W+/);

  const set = new Set([...wordsA, ...wordsB]);
  const freqA = {};
  const freqB = {};

  set.forEach((word) => {
    freqA[word] = wordsA.filter((w) => w === word).length;
    freqB[word] = wordsB.filter((w) => w === word).length;
  });

  const dot = [...set].reduce((sum, word) => sum + freqA[word] * freqB[word], 0);
  const magA = Math.sqrt(Object.values(freqA).reduce((s, v) => s + v * v, 0));
  const magB = Math.sqrt(Object.values(freqB).reduce((s, v) => s + v * v, 0));

  return dot / (magA * magB);
};
