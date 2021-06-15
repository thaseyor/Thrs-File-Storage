const fp = require('fastify-plugin');
const Redis = require('redis');

module.exports = fp(async function (fastify) {
  const redis = Redis.createClient({
    host: 'redis-12019.c54.ap-northeast-1-2.ec2.cloud.redislabs.com',
    port: '12019',
    password: process.env.REDIS,
  });

  redis.on('error', function (error) {
    console.error(error);
  });

  fastify.decorate('redis', redis);
});
