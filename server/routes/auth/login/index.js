const bcrypt = require('bcrypt')
module.exports = async function(fastify) {
  fastify.post(
    '',
    {
      schema: {
        body: {
          type: 'object',
          required: ['login', 'password'],
          properties: {
            login: {
              type: 'string',
              minLength: 4,
              maxLength: 18
            },
            password: {
              type: 'string',
              minLength: 8,
              maxLength: 18
            }
          }
        }
      }
    },
    async function(req, reply) {
      const { login, password } = req.body

      // check if user already exist
      const snapshot = await fastify.db.where('login', '==', login).get()
      if (snapshot.empty)
        return reply
          .code(400)
          .send({ message: 'User not found', statusCode: 400 })

      snapshot.forEach(async doc => {
        const user = doc.data()
        const correctPassword = await bcrypt.compare(password, user.password)
        if (!correctPassword)
          return reply
            .code(400)
            .send({ message: 'Wrong password', statusCode: 400 })

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
