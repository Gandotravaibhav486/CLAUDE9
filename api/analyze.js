import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { system, messages, max_tokens = 4096 } = req.body ?? {}

  if (!messages?.length) {
    return res.status(400).json({ error: 'messages is required' })
  }

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens,
      ...(system ? { system } : {}),
      messages,
      betas: ['pdfs-2024-09-25'],
    })
    return res.status(200).json({ text: response.content[0].text })
  } catch (err) {
    console.error('analyze error:', err)
    return res.status(500).json({ error: err.message || 'Request failed' })
  }
}
