import { IsEmail, IsString, IsOptional, IsEnum, MinLength } from 'class-validator';

export enum UserRole {
    admin = 'admin',
    customer = 'customer'
}

export class CreateUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole = UserRole.customer;
}