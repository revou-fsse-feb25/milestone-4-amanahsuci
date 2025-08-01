import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
    @ApiProperty({ example: 'johndoe@example.com', description: 'User email for login' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'strongpassword123', description: 'User password for login' })
    @IsString()
    password: string;
}