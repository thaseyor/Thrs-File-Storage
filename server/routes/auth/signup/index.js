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
      const saltRounds = 8
      const hashedPassword = await bcrypt.hash(password, saltRounds)
      const data = {
        login,
        password: hashedPassword
      }

      // check if user already exist
      const snapshot = await fastify.db.where('login', '==', login).get()
      if (!snapshot.empty)
        return reply
          .code(400)
          .send({ message: 'User already exist', statusCode: 400 })

      // create user
      await fastify.db.add(data)

      const { accessToken, refreshToken } = await fastify.generateTokens(login)

      reply.code(200).send({ accessToken, refreshToken, statusCode: 200 })
    }
  )
}
