import { 
    IsOptional, 
    IsNumber, 
    IsString, 
    IsDateString,
    Min,
    Max
} from 'class-validator';
import { Transform } from 'class-transformer';

export class TransactionQueryDto {
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    accountId?: number;

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number = 10;
}