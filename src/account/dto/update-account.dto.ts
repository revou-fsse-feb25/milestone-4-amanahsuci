import { 
    IsOptional, 
    IsNumber, 
    IsPositive, 
    IsString 
} from 'class-validator';

export class UpdateAccountDto {
    @IsOptional()
    @IsString()
    accountType?: string;
}