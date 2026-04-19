export function extractJSON(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  if (fenced) {
    try { return JSON.parse(fenced[1]) } catch {}
  }
  const bare = text.match(/\{[\s\S]*\}/)
  if (bare) {
    try { return JSON.parse(bare[0]) } catch {}
  }
  return null
}
