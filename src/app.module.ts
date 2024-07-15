import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FirestoreService } from './firestore.service';  // Add this import
import { TestController } from './test.controller';      // Add this import
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule,ConfigModule.forRoot({
    isGlobal: true,
  }),],
  controllers: [AppController,TestController],
  providers: [AppService, FirestoreService],
})
export class AppModule {}
