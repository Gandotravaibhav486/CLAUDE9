import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'api-dev-server',
        configureServer(server) {
          server.middlewares.use('/api/analyze', (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Method not allowed' }))
              return
            }

            let body = ''
            req.on('data', chunk => { body += chunk.toString() })
            req.on('end', async () => {
              try {
                const { system, messages, max_tokens = 4096 } = JSON.parse(body)

                if (!messages?.length) {
                  res.statusCode = 400
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ error: 'messages is required' }))
                  return
                }

                const { default: Anthropic } = await import('@anthropic-ai/sdk')
                const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })

                const response = await client.messages.create({
                  model: 'claude-sonnet-4-20250514',
                  max_tokens,
                  ...(system ? { system } : {}),
                  messages,
                  betas: ['pdfs-2024-09-25'],
                })

                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ text: response.content[0].text }))
              } catch (err) {
                console.error('[api/analyze]', err.message)
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: err.message || 'Request failed' }))
              }
            })
          })
        },
      },
    ],
  }
})
