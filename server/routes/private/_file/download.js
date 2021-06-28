module.exports = async function(fastify) {
  const headers = fastify.getSchema('cookies')

  fastify.get(
    '',
    {
      schema: {
        headers,
        response: {
          200: {
            type: 'object',
            required: ['url', 'message', 'statusCode'],
            properties: {
              url: { type: 'string' },
              message: { type: 'string' },
              statusCode: { type: 'number' }
            }
          }
        }
      }
    },
    async function(req, reply) {
      const { login } = await fastify.verifyToken(
        req.cookies.accessToken,
        process.env.ACCESS_TOKEN
      )

      const options = {
        version: 'v4',
        action: 'read',
        expires: Date.now() + 1000 * 60 * 5 // 5 minutes
      }

      const [url] = await fastify.bucket
        .file(`private/${login}/` + req.params.file)
        .getSignedUrl(options)

      reply
        .header('Cache-Control', 'public, max-age=300')
        .send({ url, message: 'OK', statusCode: 200 })
    }
  )
}
