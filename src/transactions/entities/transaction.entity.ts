import { Decimal } from '@prisma/client/runtime/library';

export class Transaction {
    id: number;
    fromAccountId?: number;
    toAccountId?: number;
    amount: Decimal;
    type: string;
    status: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;

    fromAccount?: {
        id: number;
        accountNumber: string;
        balance: Decimal;
        user?: {
        id: number;
        name?: string;
        email: string;
        };
    };

    toAccount?: {
        id: number;
        accountNumber: string;
        balance: Decimal;
        user?: {
        id: number;
        name?: string;
        email: string;
        };
    };

    constructor(partial: Partial<Transaction>) {
        Object.assign(this, partial);
    }
}