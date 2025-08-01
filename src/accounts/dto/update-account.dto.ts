import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AccountType } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAccountDto {
    @ApiPropertyOptional({ enum: AccountType, description: 'New account type' })
    @IsOptional()
    @IsEnum(AccountType)
    accountType?: AccountType;

    @ApiPropertyOptional({ example: 200000, description: 'New account balance' })
    @IsOptional()
    @IsString()
    balance?: number;
}