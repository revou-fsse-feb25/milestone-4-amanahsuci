import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccountType } from '@prisma/client';

@Injectable()
export class AccountRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findById(id: number) {
        return this.prisma.account.findUnique({ where: { id } });
    }

    async findByAccountNumber(accountNumber: string) {
        return this.prisma.account.findUnique({ where: { accountNumber } });
    }

    async create(userId: number, accountNumber: string, accountType: AccountType) {
        return this.prisma.account.create({
        data: {
            userId,
            accountNumber,
            accountType,
            balance: 0,
        },
        });
    }

    async updateBalance(id: number, newBalance: number) {
        return this.prisma.account.update({
        where: { id },
        data: { balance: newBalance },
        });
    }

    async findAllByUserId(userId: number) {
        return this.prisma.account.findMany({ where: { userId } });
    }
}
