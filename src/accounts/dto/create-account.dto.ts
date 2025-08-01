import { IsEnum, IsNumber, IsPositive } from 'class-validator';
import { AccountType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
    @ApiProperty({ example: 1, description: 'ID of the user who owns the account' })
    @IsNumber()
    userId: number;

    @ApiProperty({ enum: AccountType, description: 'Type of account (e.g., CHECKING, SAVINGS)' })
    @IsEnum(AccountType)
    accountType: AccountType;

    @ApiProperty({ example: 100000, description: 'Initial balance for the account' })
    @IsNumber()
    @IsPositive()
    balance: number;
}
