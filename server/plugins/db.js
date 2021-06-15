const fp = require('fastify-plugin');
const firebase = require('firebase/app');
// import 'firebase/storage';
require('firebase/firestore');

module.exports = fp(async function (fastify) {
  const apiKey = process.env.TOKEN;
  var firebaseConfig = {
    apiKey,
    authDomain: 'thrs-652a9.firebaseapp.com',
    databaseURL: 'https://thrs-652a9.firebaseio.com',
    projectId: 'thrs-652a9',
    storageBucket: 'gs://thrs-652a9.appspot.com',
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  fastify.decorate('db', db.collection('users'));
});
