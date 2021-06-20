module.exports = async function(fastify) {
  const headers = fastify.getSchema('cookies')

  fastify.delete(
    '',
    {
      schema: {
        headers,
        response: {
          200: {
            type: 'object',
            required: ['message', 'statusCode'],
            properties: {
              message: { type: 'string' },
              statusCode: { type: 'number' }
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

      const options = {
        ignoreNotFound: true
      }

      fastify.bucket
        .file(`private/${login}/` + req.params.file)
        .delete(options, err => {
          if (err) throw new Error(err)
          reply.send({ message: 'Deleted succesfully', statusCode: 200 })
        })
    }
  )
}
