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
        version: 'v2', // defaults to 'v2' if missing.
        action: 'read',
        expires: Date.now() + 1000 * 60 * 60 // one hour
      }

      // Get a v2 signed URL for the file
      const [url] = await fastify.bucket
        .file(`private/${login}/` + req.params.file)
        .getSignedUrl(options)

      reply.send({ url, message: 'OK', statusCode: 200 })
    }
  )
}
