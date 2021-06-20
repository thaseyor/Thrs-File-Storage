const humanFileSize = require('../../utils/humanFileSize.js')

module.exports = async function(fastify) {
  const headers = fastify.getSchema('cookies')
  fastify.get(
    '',
    {
      schema: {
        headers,
        response: {
          200: {
            type: 'array',
            items: {
              type: 'object',
              required: ['name', 'size', 'uploaded', 'contentType'],
              properties: {
                name: { type: 'string' },
                size: { type: 'string' },
                uploaded: { type: 'string' },
                contentType: { type: 'string' }
              }
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

      const [files] = await fastify.bucket.getFiles()

      const publicFiles = []

      files.forEach(file => {
        const filename = file.name.split('/')
        const data = file.metadata
        if (filename[0] === 'private' && filename[1] === login && filename[2]) {
          publicFiles.push({
            name: filename[2],
            size: humanFileSize(data.size),
            uploaded: data.timeCreated,
            contentType: data.contentType
          })
        }
      })
      reply.send(publicFiles)
    }
  )
}
