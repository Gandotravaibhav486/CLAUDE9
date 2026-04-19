// ~0.75 words per token; keep chunks well under model context limits
export function chunk(text, maxTokens = 3000) {
  const words = text.split(' ')
  const chunkSize = Math.floor(maxTokens * 0.75)
  const chunks = []

  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(' '))
  }
  return chunks
}
