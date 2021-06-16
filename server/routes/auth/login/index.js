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
        reply.code(200).send({ accessToken, refreshToken, statusCode: 200 })
      })
    }
  )
}
