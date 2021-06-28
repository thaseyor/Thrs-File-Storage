const humanFileSize = require('../../utils/humanFileSize.js')

module.exports = async function(fastify) {
  const fileSchema = fastify.getSchema('file')

  fastify.get(
    '',
    {
      schema: {
        response: {
          200: {
            type: 'array',
            items: fileSchema
          }
        }
      }
    },
    async function(req, reply) {
      const [files] = await fastify.bucket.getFiles()

      const publicFiles = []

      files.forEach(file => {
        const filename = file.name.split('/')
        const data = file.metadata
        if (filename[0] === 'public' && filename[1]) {
          publicFiles.push({
            name: filename[1],
            size: humanFileSize(data.size),
            uploaded: data.timeCreated,
            contentType: data.contentType || 'Unknown type'
          })
        }
      })
      reply.header('Cache-Control', 'public, max-age=60').send(publicFiles)
    }
  )
}
