import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { UsersService } from './user.service';
import { UserRepository } from './user.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [UserController],
  providers: [
    UsersService,
    UserRepository, 
    PrismaService,   
  ],
  exports: [UsersService, UserRepository], 
})
export class UsersModule {}