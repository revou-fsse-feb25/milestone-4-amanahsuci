import { IsString, IsOptional, IsEmail, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiPropertyOptional({ example: 'Jane Doe', description: 'Updated full name of the user' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: 'janedoe@example.com', description: 'Updated email of the user' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({
        example: 'newstrongpassword123',
        description: 'Updated password, at least 8 characters',
        minLength: 8,
    })
    @IsOptional()
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password?: string;
}