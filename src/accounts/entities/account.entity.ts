import { Decimal } from '@prisma/client/runtime/library';

export class Account {
    id: number;
    userId: number;
    accountNumber: string;
    balance: Decimal;
    createdAt: Date;
    updatedAt: Date;

    user?: {
        id: number;
        name?: string;
        email: string;
        role: string;
    };

    fromTransactions?: {
        id: number;
        amount: Decimal;
        type: string;
        status: string;
        description?: string;
        createdAt: Date;
    }[];

    toTransactions?: {
        id: number;
        amount: Decimal;
        type: string;
        status: string;
        description?: string;
        createdAt: Date;
    }[];

    constructor(partial: Partial<Account>) {
        Object.assign(this, partial);
    }
}