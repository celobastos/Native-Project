import * as admin from 'firebase-admin';
import * as path from 'path';

const serviceAccountPath = path.resolve(__dirname, '../config/serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://login-ea37c.firebaseio.com',
});

export default admin;
