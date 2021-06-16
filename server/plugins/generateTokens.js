const fp = require('fastify-plugin')
const jwt = require('jsonwebtoken')

module.exports = fp(async function(fastify) {
  fastify.decorate('generateTokens', async login => {
    const [accessToken, refreshToken] = await Promise.all([
      jwt.sign({ login }, process.env.ACCESS_TOKEN, {
        expiresIn: '20m'
      }),
      jwt.sign({ login }, process.env.REFRESH_TOKEN)
    ])

    await fastify.redis.set(`${login}.${refreshToken}`, true, function(
      err,
      res
    ) {
      if (err || res !== 'OK') throw new Error(err)
    })

    return { accessToken, refreshToken }
  })
})
