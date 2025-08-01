import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './user/user.module';
import { TransactionModule } from './transaction/transaction.module';
import { AccountModule } from './accounts/account.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,    
    UsersModule,
    AccountModule,
    TransactionModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
