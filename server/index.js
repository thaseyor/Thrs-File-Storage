const fastify = require('fastify')
const dotenv = require('dotenv')
const { join } = require('path')
const autoLoad = require('fastify-autoload')

dotenv.config()

const app = fastify()

app.register(require('fastify-multipart'), {
  limits: {
    fieldNameSize: 0, // Max field name size in bytes
    fieldSize: 0, // Max field value size in bytes
    fields: 0, // Max number of non-file fields
    fileSize: 100_000_000, // For multipart forms, the max file size in bytes
    files: 1, // Max number of file fields
    headerPairs: 2000 // Max number of header key=>value pairs
  }
})

const WHITE_LIST = process.env.URI_LIST.split(',')
app.register(import('fastify-cors'), {
  origin: WHITE_LIST,
  credentials: true
})

app.register(autoLoad, {
  dir: join(__dirname, 'plugins')
})

app.register(autoLoad, {
  dir: join(__dirname, 'routes'),
  routeParams: true
})

app.get('/', function(req, reply) {
  reply.send({ message: 'aboba' })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, '0.0.0.0', err => {
  if (err) return console.error(err)
  console.log(`App listens http://localhost:${PORT}`)
})
