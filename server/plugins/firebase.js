const fp = require('fastify-plugin')
const admin = require('firebase-admin')

module.exports = fp(async function(fastify) {
  const serviceAccount = {
    type: 'service_account',
    project_id: 'thrs-652a9',
    private_key_id: '94cdb3eab832e2c81f9092d46123f3bc66484849',
    private_key: process.env.KEY,
    client_email: 'firebase-adminsdk-2htck@thrs-652a9.iam.gserviceaccount.com',
    client_id: '114781257483548213313',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
      'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-2htck%40thrs-652a9.iam.gserviceaccount.com'
  }
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://thrs-652a9.firebaseio.com',
    storageBucket: process.env.BUCKET_URL
  })

  const db = admin.firestore()
  fastify.decorate('db', db.collection('users'))

  const bucket = admin.storage().bucket()

  fastify.decorate('bucket', bucket)
})
