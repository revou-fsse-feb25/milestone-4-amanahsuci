export class TransactionResponseDto {
    id: number;
    fromAccountId?: number;
    toAccountId?: number;
    amount: string; 
    type: string;
    status: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;

    fromAccount?: {
        id: number;
        accountNumber: string;
        user?: {
            name?: string;
        };
    };

    toAccount?: {
        id: number;
        accountNumber: string;
        user?: {
            name?: string;
        };
    };

    constructor(partial: Partial<TransactionResponseDto>) {
        Object.assign(this, partial);
    }
}