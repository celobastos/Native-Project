import { Injectable } from '@nestjs/common';
import admin from 'firebase-admin';
import * as path from 'path';

const serviceAccountPath = path.resolve(__dirname, '../config/serviceAccountKey.json');
@Injectable()
export class FirestoreService {
  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath as admin.ServiceAccount),
        databaseURL: 'https://login-ea37c.firebaseio.com',
      });
    }
  }

  async findUserByEmail(email: string) {
    try {
      console.log(`Querying for email: ${email.toLowerCase()}`);  // Log the email being queried
      const userRef = admin.firestore().collection('users').where('email', '==', email.toLowerCase());
      const snapshot = await userRef.get();
      
      console.log(`Query result snapshot size: ${snapshot.size}`);  // Log the size of the snapshot
      if (snapshot.empty) {
        console.log('User not found');
        return null;
      }

      let userData: any;
      snapshot.forEach(doc => {
        userData = doc.data();
        console.log(`Document ID: ${doc.id}`);
        console.log(`Document data: ${JSON.stringify(doc.data())}`);
      });

      return userData;
    } catch (error) {
      console.error('Error running query:', error);
      throw error;
    }
  }
}