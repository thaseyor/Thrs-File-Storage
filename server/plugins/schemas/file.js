const fp = require('fastify-plugin')

module.exports = fp(async function(fastify) {
  fastify.addSchema({
    $id: 'file',
    type: 'object',
    required: ['name', 'size', 'uploaded', 'contentType'],
    properties: {
      name: { type: 'string' },
      size: { type: 'string' },
      uploaded: { type: 'string' },
      contentType: { type: 'string' }
    }
  })
})
