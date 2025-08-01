import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Account } from '@prisma/client';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAccountDto): Promise<Account> {
    const { userId, accountType, balance } = data;

    return this.prisma.account.create({
      data: {
        accountType,
        balance,
        accountNumber: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  async findAll(): Promise<Account[]> {
    return this.prisma.account.findMany({
      include: {
        user: true, 
      },
    });
  }

  async findById(id: number): Promise<Account | null> {
    return this.prisma.account.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: number): Promise<Account[]> {
    return this.prisma.account.findMany({
      where: { userId },
    });
  }

  async update(id: number, data: UpdateAccountDto): Promise<Account> {
    const account = await this.prisma.account.findUnique({ where: { id } });
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return this.prisma.account.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<Account> {
    const account = await this.prisma.account.findUnique({ where: { id } });
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return this.prisma.account.delete({
      where: { id },
    });
  }

  async updateBalance(accountId: number, newBalance: number): Promise<Account> {
    return this.prisma.account.update({
      where: { id: accountId },
      data: { balance: newBalance },
    });
  }
}
