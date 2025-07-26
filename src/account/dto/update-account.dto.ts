import { 
    IsOptional, 
    IsNumber, 
    IsPositive, 
    IsString 
} from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    accountType?: string;
}