module.exports = async function(fastify) {
  fastify.get('', async function(req, reply) {
    fastify.redis.keys(`*`, function(err, res) {
      console.log(res)
    })

    reply.code(200).send({ statusCode: 200 })
  })
}
