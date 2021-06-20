const fp = require('fastify-plugin')

module.exports = fp(async function(fastify) {
  fastify.setErrorHandler((error, request, reply) => {
    const { message, validation, name } = error

    if (validation) {
      const { statusCode, message } = validate(error)
      return reply.code(statusCode).send({ message, statusCode })
    }

    if (name === 'TokenExpiredError')
      return reply.code(403).send({
        action: 'refresh',
        message: 'Token has been expired',
        statusCode: 403
      })

    reply.code(500).send({ message: 'Something went wrong!', statusCode: 500 })
    console.log(error)
  })
})

const validate = validationError => {
  const context = validationError.validationContext

  switch (context) {
    case 'headers':
      return { statusCode: 401, message: 'Unauthorized' }

    case 'querystring': {
      const error = validationError.validation[0]
      return {
        statusCode: 400,
        message: `Invalid query parameters: ${error.dataPath.substring(1)} ${
          error.message
        }`
      }
    }

    case 'params':
      return { statusCode: 400, message: 'Invalid id' }

    case 'body':
      return {
        statusCode: 400,
        message: `Invalid body: ${validationError.validation[0].message}`
      }

    default:
      return { statusCode: 400, message: 'Bad request' }
  }
}
