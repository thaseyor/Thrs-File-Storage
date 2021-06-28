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
        expires: Date.now() + 1000 * 60 * 5 // 5 minutes
      }

      const [url] = await fastify.bucket
        .file('public/' + req.params.file)
        .getSignedUrl(options)
      console.log(url)
      reply
        .header('Cache-Control', 'public, max-age=300')
        .send({ url, message: 'OK', statusCode: 200 })
    }
  )
}
