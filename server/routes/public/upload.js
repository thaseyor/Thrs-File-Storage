const util = require('util')
const { pipeline } = require('stream')
const pump = util.promisify(pipeline)
const humanFileSize = require('../../utils/humanFileSize.js')

module.exports = async function(fastify) {
  fastify.post(
    '',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            required: ['file', 'statusCode'],
            properties: {
              file: {
                type: 'object',
                required: ['name', 'size', 'uploaded', 'contentType'],
                properties: {
                  name: { type: 'string' },
                  size: { type: 'string' },
                  uploaded: { type: 'string' },
                  contentType: { type: 'string' }
                }
              },
              statusCode: { type: 'number' }
            }
          }
        }
      }
    },
    async function(req, reply) {
      const data = await req.file()

      const file = fastify.bucket.file('public/' + data.filename)
      await pump(data.file, file.createWriteStream({ gzip: true }))
      const [metadata] = await file.getMetadata()

      reply.send({
        file: {
          name: metadata.name.split('/')[1],
          size: humanFileSize(metadata.size),
          uploaded: metadata.timeCreated,
          contentType: metadata.contentType
        },
        statusCode: 200
      })
    }
  )
}