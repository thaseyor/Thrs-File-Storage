const humanFileSize = require('../../utils/humanFileSize.js')

module.exports = async function(fastify) {
  fastify.get('', async function(req, reply) {
    const [files] = await fastify.storage.getFiles()

    const publicFiles = []

    files.forEach(file => {
      const filename = file.name.split('/')
      const data = file.metadata
      if (filename[0] === 'public' && filename[1]) {
        publicFiles.push({
          name: filename[1],
          size: humanFileSize(data.size),
          uploaded: data.timeCreated,
          contentType: data.contentType
        })
      }
    })
    reply.send(publicFiles)
  })
}
