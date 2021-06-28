const fp = require('fastify-plugin')

module.exports = fp(async function(fastify) {
  fastify.addSchema({
    $id: 'cookies',
    type: 'object',
    required: ['cookie'],
    properties: {
      cookie: {
        type: 'string',
        pattern: '(?=.*refreshToken=)(?=.*accessToken=)'
      }
    }
  })
})
