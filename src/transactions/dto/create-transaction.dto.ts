import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsObject,
    ValidateNested,
    Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class AdditionalInfoDto {
    @IsString()
    @IsOptional()
    note?: string;
}

class BaseTransactionDto {
    @IsNumber()
    @Min(0.01)
    amount: number;

    @IsObject()
    @ValidateNested()
    @IsOptional()
    @Type(() => AdditionalInfoDto)
    additional_info?: AdditionalInfoDto;
}

export class TransferTransactionDto extends BaseTransactionDto {
    @IsString()
    @IsNotEmpty()
    receiver_account: string;

    @IsString()
    @IsNotEmpty()
    sender_account: string;

    @IsNumber()
    @IsNotEmpty()
    balance: number;

    @IsString()
    description: string;
}

export class WithdrawTransactionDto extends BaseTransactionDto {
    @IsString()
    @IsNotEmpty()
    sender_account: string;

    @IsString()
    description: string;
}

export class DepositTransactionDto extends BaseTransactionDto {
    @IsString()
    @IsNotEmpty()
    receiver_account: string;
}


