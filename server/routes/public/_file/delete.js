module.exports = async function(fastify) {
  fastify.delete('', function(req, reply) {
    const options = {
      ignoreNotFound: true
    }

    fastify.bucket.file('public/' + req.params.file).delete(options, err => {
      if (err) throw new Error(err)
      reply.send({ message: 'Deleted succesfully', statusCode: 200 })
    })
  })
}
