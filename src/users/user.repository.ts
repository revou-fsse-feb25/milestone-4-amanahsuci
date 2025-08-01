// src/user/user.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepository {
    findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
            select: {
            id: true, 
            email: true,
            name: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            },
        })
        throw new Error('Method not implemented.');
    }
    constructor(private readonly prisma: PrismaService) {}

    async create(data: Prisma.UserCreateInput) {
        return this.prisma.user.create({ data });
    }

    async findById(id: number) {
        return this.prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
        });
    }

    async findWithPasswordById(id: number) {
        return this.prisma.user.findUnique({
        where: { id },
        });
    }

    async findWithPasswordByEmail(email: string) {
        return this.prisma.user.findUnique({
        where: { email },
        });
    }

    async findAll() {
        return this.prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
        });
    }

    async update(id: number, data: Prisma.UserUpdateInput) {
        return this.prisma.user.update({
        where: { id },
        data,
        });
    }

    async delete(id: number) {
        return this.prisma.user.delete({
        where: { id },
        });
    }

    async getProfile(id: number) {
        return this.prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            accounts: {
            select: {
                id: true,
                accountNumber: true,
                balance: true,
                createdAt: true,
            },
            },
            createdAt: true,
            updatedAt: true,
        },
        });
    }

    async hasAccounts(userId: number): Promise<boolean> {
        const count = await this.prisma.account.count({
        where: { userId },
        });
        return count > 0;
    }
    }
