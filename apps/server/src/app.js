import Fastify from 'fastify'

export function buildApp(options = {}) {
  const app = Fastify({
    logger: true,
    ...options,
  })

  app.get('/', async () => {
    return { message: 'Fastify server is running' }
  })

  app.get('/health', async () => {
    return { status: 'ok' }
  })

  return app
}
