const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { print } = require('redis');
module.exports = async function (fastify) {
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
              maxLength: 18,
            },
            password: {
              type: 'string',
              minLength: 8,
              maxLength: 18,
            },
          },
        },
      },
    },
    async function (req, reply) {
      const { login, password } = req.body;
      const saltRounds = 8;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const data = {
        login,
        password: hashedPassword,
      };

      const snapshot = await fastify.db.where('login', '==', login).get();
      if (!snapshot.empty)
        return reply
          .code(400)
          .send({ message: 'User already exist', statusCode: 400 });

      await fastify.db.add(data);

      const [accessToken, refreshToken] = await Promise.all([
        jwt.sign({ login }, process.env.ACCESS_TOKEN, {
          expiresIn: '30m',
        }),
        jwt.sign({ login }, process.env.REFRESH_TOKEN),
      ]);

      await fastify.redis.set(refreshToken, 'amogus', print);
      reply.code(200).send({ accessToken, refreshToken });
    }
  );
};
