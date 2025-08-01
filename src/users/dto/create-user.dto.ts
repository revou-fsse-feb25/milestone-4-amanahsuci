import { IsEmail, IsString, IsOptional, IsEnum, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UserRole {
    admin = 'admin',
    customer = 'customer'
}

export class CreateUserDto {
    @ApiPropertyOptional({ example: 'John Doe', description: 'Full name of the user' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ example: 'johndoe@example.com', description: 'Unique email of the user' })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'strongpassword123',
        description: 'Password with minimum 8 characters',
        minLength: 8,
    })
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;

    @ApiPropertyOptional({
        enum: UserRole,
        default: UserRole.customer,
        description: 'Role of the user, either admin or customer',
    })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole = UserRole.customer;
}