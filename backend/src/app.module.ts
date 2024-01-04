import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [AuthModule, UsersModule, TasksModule, MongooseModule.forRoot('mongodb://mongodb:27017/project')],
  controllers: [AppController],
  providers: [AppService],
}) 
export class AppModule {}
