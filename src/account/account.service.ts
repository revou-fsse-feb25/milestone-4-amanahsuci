import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Account, AccountType } from '@prisma/client';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAccountDto) : Promise<Account> {
    const { userId, accountType, balance } = data;

    return this.prisma.account.create({
      data: {
        accountType,
        balance,
        user: {
          connect: { id: userId },
        },
      }
    });
  }

  async findById(id: number) {
    return this.prisma.account.findUnique({
      where : { id }, 
    });
  }

  async findAllByUserId(userId: number) {
    return this.prisma.account.findMany({
      where: { userId },
    });
  }

  async updateBalance(accountId: number, newBalance: number) {
    return this.prisma.account.update({
      where: { id: accountId },
      data: { balance: newBalance },
    });
  }
}