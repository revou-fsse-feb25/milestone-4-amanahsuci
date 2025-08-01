import { IsEnum, IsNumber, IsPositive } from 'class-validator';
import { AccountType } from '@prisma/client';

export class CreateAccountDto {
    @IsNumber()
    userId: number;

    @IsEnum(AccountType)
    accountType: AccountType;

    @IsNumber()
    @IsPositive()
    balance: number;
}
