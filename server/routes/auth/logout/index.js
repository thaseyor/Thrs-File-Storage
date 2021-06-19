module.exports = async function(fastify) {
  const headers = fastify.getSchema('cookies')
  fastify.delete('', { schema: { headers } }, async function(req, reply) {
    reply.clearCookie('accessToken')
    reply.clearCookie('refreshToken')

    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) return reply.send({ message: 'OK', statusCode: 200 })
    const { login } = await fastify.verifyToken(
      refreshToken,
      process.env.REFRESH_TOKEN
    )

    fastify.redis.del(`${login}.${refreshToken}`)

    reply.send({ message: 'OK', statusCode: 200 })
  })
}
