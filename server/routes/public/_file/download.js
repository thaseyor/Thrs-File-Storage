module.exports = async function(fastify) {
  fastify.get(
    '',
    {
      schema: {
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
      const options = {
        version: 'v4',
        action: 'read',
        expires: Date.now() + 1000 * 60 * 60 * 4 // 4 hours
      }

      const [url] = await fastify.bucket
        .file('public/' + req.params.file)
        .getSignedUrl(options)

      reply.send({ url, message: 'OK', statusCode: 200 })
    }
  )
}
