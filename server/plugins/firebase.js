const fp = require('fastify-plugin')
const admin = require('firebase-admin')

module.exports = fp(async function(fastify) {
  const serviceAccount = {
    type: 'service_account',
    project_id: 'thrs-652a9',
    private_key_id: '94cdb3eab832e2c81f9092d46123f3bc66484849',
    private_key: `-----BEGIN PRIVATE KEY-----\n${process.env.KEY1}\n${process.env.KEY2}\n${process.env.KEY3}\n${process.env.KEY4}\n${process.env.KEY5}\nGda4A8iZzDuUsiW2ksmbhXTs5+fKKh/rjqeWXvh43f+r2C5VFG2gcnjnj7l/Gf1C\nE6RFwqEvAgMBAAECggEALWUhwW7JvTHbTbeSRJ3eSsjhbl+uQWOfFioxkDd2LnRH\nL56xONyaJnL006LRWk0ELx7u+5ekTkoK6b898NTTeY3l5gWDPgBLEzQrzvoV6Zku\nEgP5GziPA7nzRciS61FizRwnmP9jK9IcCXw4uBckEQe/tLPP6bHt1MG2x4S1ibPx\n+n2iomPrJmi3Bxk2LAdk27Hn+p8l/yeBA3VUtNbILLkm/4UAOZoLfS+GV1v4ZTNo\nkRKND93UZYb5UjFG9rsQS3uU2C5SebHCg9ThoaVZC/X0GwpjiyOJ5y778gooPUtX\ngkL6QesiC42A5kDa2U1h36pjKeNLPzqcALkD+YTUSQKBgQDoGxn+ZOWhjyllXRis\nAMu5c78q32W7DNEe3bAFjAMMitjqihp+GLUhKAH1sSOx/iNnI4nGBtqhaS1Ov0T0\n3698sXEQvQSSYGqUGYWw/l/9v5EcM159QkU+0B1SL1PdjZmhbtyJY+8BaxZDESpL\nui4OROie4eWP5F/yTWBhURO6+QKBgQDGpTF1kPYCRRJfEIqyKCTAaZN2PMnLU5f4\n5W2sdz38KmTdiJzFySE2xI//iWjmcokLUA1liQ9IlEuSzP0KDMjzuC7juYTpWTl/\nua3lwfZigkf0JjPuymBTJ3MnEmFphITziE3G/h5atZrZIbMdNR1bGknvCGiQ64LY\nCGPPI/BfZwKBgB4OvGwEVvR4HK1CxBoqNDe89ImxynPRshckMFJXkmGCbZrZ7Zpc\nysATdUWC/hNjzOPjZ0kcxB1ZCIQFIwHvIcOtGu5G/BuUnti1AWotVvL+ZuVXBaqE\n9YCv5Mwq0tqDJt0QBUFJjr8JRiXDSE3sO2Cfrdw9dsQOmBpByPRxUnPJAoGARaNd\nzmhORgdu5FLJPKGkGKwqXPX8jEI28bOEmkSHP2KhT6R3yUK0WR3ZmWzTkI4wiv26\nZJEDAZ+zSriAMMjAnehAz+aWuLNl2+f9FaHEvU4M6YOHCzx5Pk2DKfxgl/w0G6f6\nFDu76nLl4R7WSvP24Zw6tQiOl9doXFG8o75moxsCgYAgmiUS3Qb/V5kMJ1vebJkD\nfI0yDYTk+CtUzbUQMvNYHbpsqWJdx9wBqKeF+CfdV6ZysRmmCpLWtITFBiuBhaSQ\n${process.env.KEY6}\nCfExIFbI6zOojTCZbPen0A==\n-----END PRIVATE KEY-----\n`,
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
