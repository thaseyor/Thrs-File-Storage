const fastify = require('fastify');
const dotenv = require('dotenv');
const { fileURLToPath } = require('url');
const { dirname, join } = require('path');
const autoLoad = require('fastify-autoload');

dotenv.config();

const app = fastify();

app.register(autoLoad, {
  dir: join(__dirname, 'plugins'),
});

app.register(autoLoad, {
  dir: join(__dirname, 'routes'),
  routeParams: true,
});

app.get('/', function (req, reply) {
  reply.send({ message: 'aboba' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', (err) => {
  if (err) return console.error(err);
  console.log(`App listens http://localhost:${PORT}`);
});
