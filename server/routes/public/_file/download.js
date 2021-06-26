module.exports = async function(fastify) {
  fastify.get('', async function(req, reply) {
    const options = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + 1000 * 60 // one minute
    }

    const [url] = await fastify.bucket
      .file('public/' + req.params.file)
      .getSignedUrl(options)

    reply.send({ url, message: 'OK', statusCode: 200 })
  })
}
