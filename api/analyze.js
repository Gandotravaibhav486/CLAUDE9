import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are a legal contract analyser specialising in Indian rental agreements.
Analyse the provided contract and return ONLY a JSON object — no preamble, no explanation — with this exact shape:

{
  "riskScore": <integer 0-100>,
  "tenantBias": <integer 0-100, percentage of clauses favouring tenant>,
  "ownerBias": <integer 0-100, percentage of clauses favouring owner>,
  "summary": "<2-3 sentence plain-English overview of the contract's overall risk>",
  "financialRisks": [
    {
      "title": "<short risk name>",
      "description": "<what could go wrong and why>",
      "estimatedImpact": "<₹ amount or range e.g. ₹20,000–₹80,000>",
      "severity": "high|medium|low"
    }
  ],
  "clauses": [
    {
      "id": "<unique slug e.g. clause_1>",
      "type": "illegal|unfair|risky|neutral",
      "severity": "high|medium|low",
      "originalText": "<exact verbatim text from contract>",
      "explanation": "<plain English explanation of why this is problematic>",
      "legalRef": "<relevant Indian law e.g. Model Tenancy Act 2021 S.11, or null>"
    }
  ],
  "fixes": [
    {
      "clauseId": "<matches a clause id above>",
      "originalText": "<the problematic original text>",
      "suggestedText": "<safer rewrite that protects the tenant>",
      "reason": "<one sentence on why this fix is safer>"
    }
  ]
}

Focus on Indian rental law. Use ₹ for all amounts. Only flag clauses that are genuinely problematic.`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { contractText, images } = req.body ?? {}

  if (!contractText && !images?.length) {
    return res.status(400).json({ error: 'No contract content provided.' })
  }
  if (contractText && contractText.trim().length < 50) {
    return res.status(400).json({ error: 'Contract text is too short.' })
  }

  try {
    const userContent = images?.length
      ? [
          ...images.map(img => ({
            type: 'image',
            source: { type: 'base64', media_type: img.mediaType, data: img.data },
          })),
          { type: 'text', text: 'Analyse this Indian rental agreement shown in the image(s) above.' },
        ]
      : `Analyse this Indian rental agreement:\n\n${contractText.slice(0, 15000)}`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }],
    })

    const raw = message.content[0].text

    let result
    try {
      result = JSON.parse(raw)
    } catch {
      const match = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/) ?? raw.match(/\{[\s\S]*\}/)
      result = JSON.parse(match?.[1] ?? match?.[0])
    }

    return res.status(200).json(result)
  } catch (err) {
    console.error('analyze error:', err)
    return res.status(500).json({ error: 'Analysis failed. Please try again.' })
  }
}
