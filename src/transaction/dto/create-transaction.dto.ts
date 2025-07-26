import { 
    IsNumber, 
    IsString, 
    IsOptional, 
    IsPositive, 
    IsIn,
    ValidateIf,
    IsNotEmpty
} from 'class-validator';

export class CreateTransactionDto {
    @ValidateIf(o => o.type === 'TRANSFER' || o.type === 'WITHDRAWAL')
    @IsNumber()
    @IsNotEmpty()
    fromAccountId?: number;

    @ValidateIf(o => o.type === 'TRANSFER' || o.type === 'DEPOSIT')
    @IsNumber()
    @IsNotEmpty()
    toAccountId?: number;

    @IsNumber()
    @IsPositive({ message: 'Amount must be positive' })
    amount: number;

    @IsString()
    @IsIn(['TRANSFER', 'DEPOSIT', 'WITHDRAWAL'], {
        message: 'Type must be TRANSFER, DEPOSIT, or WITHDRAWAL'
    })
    type: string;

    @IsOptional()
    @IsString()
    description?: string;
}
