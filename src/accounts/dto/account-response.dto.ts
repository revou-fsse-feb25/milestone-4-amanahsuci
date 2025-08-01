export class AccountResponseDto {
    id: number;
    userId: number;
    accountNumber: string;
    balance: string; // Decimal as string for precision
    createdAt: Date;
    updatedAt: Date;

    user?: {
        id: number;
        name?: string;
        email: string;
    };

    constructor(partial: Partial<AccountResponseDto>) {
        Object.assign(this, partial);
    }
}