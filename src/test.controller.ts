import { Controller, Get, Query } from '@nestjs/common';
import { FirestoreService } from './firestore.service';  // Adjust the import path accordingly

@Controller('test')
export class TestController {
  constructor(private readonly firestoreService: FirestoreService) {}

  @Get('findUser')
  async findUser(@Query('email') email: string) {
    if (!email) {
      return { message: 'Email query parameter is required' };
    }
    try {
      const user = await this.firestoreService.findUserByEmail(email);
      if (user) {
        return { message: 'User found', user };
      } else {
        return { message: 'User not found' };
      }
    } catch (error) {
      return { message: 'Error retrieving user', error: error.message };
    }
  }
}
