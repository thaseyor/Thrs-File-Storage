const humanFileSize = require('../../utils/humanFileSize.js')

module.exports = async function(fastify) {
  const headers = fastify.getSchema('cookies')
  const fileSchema = fastify.getSchema('file')
  fastify.get(
    '',
    {
      schema: {
        headers,
        response: {
          200: {
            type: 'array',
            items: fileSchema
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

      const privateFiles = []

      files.forEach(file => {
        const filename = file.name.split('/')
        const data = file.metadata
        if (filename[0] === 'private' && filename[1] === login && filename[2]) {
          privateFiles.push({
            name: filename[2],
            size: humanFileSize(data.size),
            uploaded: data.timeCreated,
            contentType: data.contentType
          })
        }
      })
      reply.header('Cache-Control', 'public, max-age=60').send(privateFiles)
    }
  )
}
