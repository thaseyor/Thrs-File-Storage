const fp = require('fastify-plugin');
const jwt = require('jsonwebtoken');

module.exports = fp(async function(fastify) {
  fastify.decorate('verifyToken', (token, secret) => {
    return jwt.verify(token, secret);
  });
});
