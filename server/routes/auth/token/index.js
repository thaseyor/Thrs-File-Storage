module.exports = async function(fastify) {
  const headers = fastify.getSchema('cookies')
  fastify.post(
    '',
    {
      schema: { headers }
    },
    async function(req, reply) {
      const token = req.cookies.refreshToken

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
          reply.clearCookie('accessToken')
          reply.clearCookie('refreshToken')
          reply.code(403).send({
            action: 'logout',
            message: 'Token is invalid',
            statusCode: 403
          })
          return
        }

        fastify.redis.del(`${login}.${token}`)

        const { accessToken, refreshToken } = await fastify.generateTokens(
          login
        )

        const url = new URL(process.env.FRONTEND_URI)
        const year = 60 * 60 * 24 * 365

        reply.setCookie('accessToken', accessToken, {
          path: '/',
          sameSite: 'strict',
          httpOnly: true,
          secure: true,
          domain: url.hostname,
          maxAge: year
        })
        reply.setCookie('refreshToken', refreshToken, {
          path: '/',
          sameSite: 'strict',
          httpOnly: true,
          secure: true,
          domain: url.hostname,
          maxAge: year
        })

        reply.send({ message: 'OK', statusCode: 200 })
      })
    }
  )
}
