module.exports = async function(fastify) {
  fastify.post(
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
    async function(req, reply) {
      const token = req.body.refreshToken

      const { login } = await fastify.verifyToken(
        token,
        process.env.REFRESH_TOKEN
      )

      fastify.redis.get(`${login}.${token}`, async function(err, res) {
        if (err) throw new Error(err)

        if (!res) {
          fastify.redis.keys(`${login}*`, function(err, res) {
            res.forEach(refToken => fastify.redis.del(refToken))
          })
          reply.code(403).send({ message: 'Token is invalid', statusCode: 403 })
          return
        }

        fastify.redis.del(`${login}.${token}`)

        const { accessToken, refreshToken } = await fastify.generateTokens(
          login
        )

        reply.send({ accessToken, refreshToken, statusCode: 200 })
      })
    }
  )
}
