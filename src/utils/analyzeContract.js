const SYSTEM_PROMPT = `You are an expert legal analyst specialising in Indian rental agreements and property law.

Analyse the provided rental agreement thoroughly and extract EVERY clause — not just risky ones. Include clauses of all risk levels.

Also detect any hidden legal references such as Articles (Art.), Sections (S./Sec./Section), Schedules, Acts, Rules, or Regulations that are mentioned but not defined within the contract itself.

Return ONLY a valid JSON object with this exact structure — no preamble, no explanation, no markdown fences:

{
  "title": "<descriptive title e.g. Residential Rental Agreement — Mumbai>",
  "summary": "<3-4 sentence plain-English overview: who the parties are, property details, key terms like rent, duration, deposit>",
  "overallRisk": "high|medium|low",
  "riskSummary": "<2-3 sentences explaining the overall risk level and the single most critical issue the reader should know>",
  "clauses": [
    {
      "id": "clause_1",
      "title": "<short descriptive title e.g. Security Deposit>",
      "originalText": "<exact verbatim text of this clause from the contract>",
      "plainEnglish": "<clear plain-English explanation of what this clause means in practice>",
      "risk": "unfair|high|medium|low|info",
      "riskReason": "<why this risk level was assigned — be specific, cite Indian law where relevant>",
      "recommendation": "<actionable advice: what to negotiate, flag, add, or accept as-is>",
      "relatedRefs": ["<legal references e.g. Model Tenancy Act 2021 S.6, Transfer of Property Act 1882 S.105>"],
      "isKeyClause": true|false
    }
  ],
  "hiddenReferences": [
    {
      "ref": "<the reference as written e.g. Art. 12, Schedule B, Section 144 CrPC>",
      "context": "<the exact sentence or clause where this appears>",
      "explanation": "<what this law, article, or schedule likely means and why it matters to the tenant>"
    }
  ]
}

Risk level rules (apply strictly):
- unfair: ONLY use for clauses so severely one-sided that the tenant should REFUSE TO SIGN until this clause is removed or rewritten. Examples: waiving all liability for landlord negligence, forfeiting deposit without any conditions, eviction without notice. Use at most 1-2 times per contract. Most contracts will have zero unfair clauses. Do NOT use this for merely inconvenient clauses.
- high: illegal under Indian law, void/unenforceable, or creates very serious financial exposure
- medium: potentially unfair, worth negotiating, or creates meaningful financial exposure
- low: minor concern, standard but worth being aware of
- info: neutral, standard boilerplate, or informational clause

isKeyClause: Mark true for the 3-5 most important clauses the tenant must fully understand before signing (e.g. deposit terms, rent escalation, lock-in period, eviction conditions). Mark false for all others.

Extract every clause you can identify. Do not skip neutral clauses.
Use ₹ for all amounts. Base analysis on: Transfer of Property Act 1882, Model Tenancy Act 2021, relevant State Rent Control Acts, Registration Act 1908, Indian Contract Act 1872.`

function readAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = e => resolve(e.target.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function robustExtractJSON(text) {
  // 1. Try fenced code block first
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  if (fenced) {
    try { return JSON.parse(fenced[1]) } catch {}
  }
  // 2. Find outermost { ... } ignoring leading prose
  const start = text.indexOf('{')
  const end   = text.lastIndexOf('}')
  if (start !== -1 && end > start) {
    try { return JSON.parse(text.slice(start, end + 1)) } catch {}
  }
  return null
}

export async function analyzeContract({ files, mode }) {
  let userContent

  if (mode === 'pdf') {
    // Send PDF as a native document block so Claude can read scanned/image-based PDFs
    const data = await readAsBase64(files[0])
    userContent = [
      {
        type: 'document',
        source: { type: 'base64', media_type: 'application/pdf', data },
      },
      { type: 'text', text: 'Analyse this Indian rental agreement. Extract every clause.' },
    ]
  } else {
    const imgBlocks = await Promise.all(
      files.map(async f => ({
        type: 'image',
        source: { type: 'base64', media_type: f.type, data: await readAsBase64(f) },
      }))
    )
    userContent = [
      ...imgBlocks,
      { type: 'text', text: 'Analyse this Indian rental agreement shown in the image(s) above. Extract every clause.' },
    ]
  }

  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }],
      max_tokens: 8192,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Analysis failed')
  }

  const { text } = await res.json()
  const result   = robustExtractJSON(text)
  if (!result) throw new Error('Could not parse analysis response. Please try again.')
  return result
}
