module.exports = async function(fastify) {
  fastify.get('', async function(req, reply) {
    const options = {
      version: 'v2', // defaults to 'v2' if missing.
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60 // one hour
    }

    // Get a v2 signed URL for the file
    const [url] = await fastify.bucket
      .file('public/' + req.params.file)
      .getSignedUrl(options)

    reply.send({ url, message: 'OK', statusCode: 200 })
  })
}
