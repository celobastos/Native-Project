import { Controller, Post, Body } from '@nestjs/common';
import admin from '../firebase-admin';

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() body: { email: string, password: string }) {
    try {
      console.log(`Login attempt: ${body.email}`);  // Log da tentativa de login

      // Converter o email para minúsculas para lidar com a sensibilidade de caso
      const email = body.email.toLowerCase();
      console.log(`Normalized email: ${email}`);  // Log do email normalizado

      const userRef = admin.firestore().collection('users').where('email', '==', email);
      const snapshot = await userRef.get();

      console.log(`Snapshot empty: ${snapshot.empty}`);  // Log se o snapshot está vazio

      if (snapshot.empty) {
        console.log('User not found');  // Log usuário não encontrado
        return { statusCode: 404, message: 'User not found' };
      }

      let userData: any;
      snapshot.forEach(doc => {
        userData = doc.data();
        console.log(`Document ID: ${doc.id}`);  // Log ID do documento
        console.log(`Document data: ${JSON.stringify(doc.data())}`);  // Log dos dados do documento
      });

      if (userData) {
        // Verificar a senha diretamente
        if (userData.senha === body.password) {
          const customToken = await admin.auth().createCustomToken(userData.uid);
          console.log(`Login successful: ${body.email}`);  // Log login bem-sucedido
          return { statusCode: 201, token: customToken };
        } else {
          console.log('Invalid password');  // Log senha inválida
          return { statusCode: 401, message: 'Invalid password' };
        }
      } else {
        console.log('User data not found after snapshot');  // Log se os dados do usuário não foram encontrados
        return { statusCode: 404, message: 'User data not found' };
      }
    } catch (error) {
      console.error(`Login error: ${error.message}`);  // Log do erro
      return { statusCode: 500, message: 'Internal server error' };
    }
  }
}
