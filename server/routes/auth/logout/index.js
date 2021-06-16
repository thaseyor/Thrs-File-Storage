const bcrypt = require('bcrypt')
module.exports = async function(fastify) {
  fastify.delete(
    '',
    {
      schema: {
        body: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: { type: 'string' }
          }
        }
      }
    },
    async function(req, reply) {}
  )
}
