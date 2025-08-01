import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionStatus, TransactionType } from '@prisma/client';

@Injectable()
export class TransactionRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: {
        fromAccountId?: number;
        toAccountId?: number;
        amount: number;
        type: TransactionType;
        status: TransactionStatus;
        description?: string;
    }) {
        return this.prisma.transaction.create({ data });
    }

    async findById(id: number) {
        return this.prisma.transaction.findUnique({ where: { id } });
    }

    async findAll() {
        return this.prisma.transaction.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            fromAccount: true,
            toAccount: true,
        },
        });
    }

    async delete(id: number) {
        return this.prisma.transaction.delete({ where: { id } });
    }
}
