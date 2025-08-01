import {
    Injectable,
    ConflictException,
    UnauthorizedException,
    NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        ) {}
        
    async register(dto: CreateUserDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);
    
        try {
            const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                password: hashedPassword,
            },
            });

        return { message: 'User registered successfully', userId: user.id };
        } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            throw new ConflictException('Failed to create user');
        }
        throw error;
        }
    }

        async login(dto: LoginUserDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
    
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }
    
        const isPasswordMatch = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordMatch) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        const accessToken = await this.jwtService.signAsync(payload);
    
        return {
            message: 'Login successful',
            accessToken,
        };
    }

    async getProfile(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            },
        });

        if (!user) throw new NotFoundException('User not found');

        return user;
    }
}
  