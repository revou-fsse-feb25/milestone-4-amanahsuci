import { IsOptional, IsString } from 'class-validator';
import { AccountType } from '@prisma/client';

export class UpdateAccountDto {
    @IsOptional()
    @IsString()
    accountType?: AccountType;
}