import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import * as admin from 'firebase-admin';
import * as bcrypt from 'bcrypt';
import * as path from 'path';

// Verifique se o Firebase já foi inicializado
if (!admin.apps.length) {
  const serviceAccount = require(path.resolve(__dirname, '../../config/serviceAccountKey.json')); // Atualize o caminho

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://login-ea37c.firebaseio.com'  // Atualize com a URL correta do seu banco de dados
  });
}

const firestore = admin.firestore();

async function hashPasswords() {
  try {
    const usersRef = firestore.collection('users');
    const snapshot = await usersRef.get();

    if (snapshot.empty) {
      console.log('No users found.');
      return;
    }

    snapshot.forEach(async (doc) => {
      const userData = doc.data();
      const senha = userData.senha;

      // Verifique se a senha não está hasheada (assumindo que senhas hasheadas têm mais de 30 caracteres)
      if (typeof senha === 'string' && senha.length < 30) {
        const hashedPassword = await bcrypt.hash(senha, 10);
        await doc.ref.update({ senha: hashedPassword });
        console.log(`Password hashed for user: ${userData.email}`);
      } else {
        console.log(`Password already hashed or invalid for user: ${userData.email}`);
      }
    });
  } catch (error) {
    console.error(`Error hashing passwords: ${error.message}`);
  }
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  await hashPasswords();
  await app.close();
}

bootstrap();
