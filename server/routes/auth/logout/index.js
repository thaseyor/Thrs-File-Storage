module.exports = async function(fastify) {
  const headers = fastify.getSchema('cookies')
  fastify.delete('', { schema: { headers } }, async function(req, reply) {
    reply.clearCookie('accessToken', {
      path: '/',
      sameSite: 'strict',
      httpOnly: true,
      secure: true
    })
    reply.clearCookie('refreshToken', {
      path: '/',
      sameSite: 'strict',
      httpOnly: true,
      secure: true
    })

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
