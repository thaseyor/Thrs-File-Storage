const { print } = require('redis');

module.exports = async function (fastify) {
  fastify.get(
    '',
    {
      schema: {
        query: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: { type: 'string' },
          },
        },
      },
    },
    async function (req, reply) {
      const refreshToken = req.query.refreshToken;

      const token = await fastify.redis.get(refreshToken, print);

      fastify.redis.del(refreshToken);

      reply.send({ token });
    }
  );
};
