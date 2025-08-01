import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  create(createUserDto: { email: string; name: string; password: string; }) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email, password, role = UserRole.customer, name } = createUserDto;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await this.userRepository.create({
      email,
      password: hashedPassword,
      role,
      name,
    });

    const token = this.generateToken(newUser.id, newUser.email);
    
    const { password: _, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword, token };
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findWithPasswordByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = this.generateToken(user.id, user.email);
    return { user: userWithoutPassword, token };
  }

  async findAll() {
    return this.userRepository.findAll();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id); 

    if (updateUserDto.email) {
      const userWithSameEmail = await this.userRepository.findByEmail(updateUserDto.email);
      if (userWithSameEmail && userWithSameEmail.id !== id) {
        throw new ConflictException('Email already in use');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 12);
    }

    const updatedUser = await this.userRepository.update(id, updateUserDto);
    
    if (updatedUser && 'password' in updatedUser) {
      const { password: _, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    }
    
    return updatedUser;
  }

  async remove(id: number) {
    await this.findOne(id);

    const hasAccounts = await this.userRepository.hasAccounts(id);
    if (hasAccounts) {
      throw new BadRequestException('User has active accounts. Please close them first.');
    }

    await this.userRepository.delete(id);
    return { message: 'User deleted successfully' };
  }

  async getProfile(id: number) {
    const user = await this.userRepository.getProfile(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async validateUser(id: number) {
    const user = await this.findOne(id);
    return user;
  }

  async changePassword(id: number, currentPassword: string, newPassword: string) {
    const user = await this.userRepository.findWithPasswordById(id);
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await this.userRepository.update(id, { password: hashed });
    return { message: 'Password changed successfully' };
  }

  private generateToken(id: number, email: string): string {
    return this.jwtService.sign({ sub: id, email });
  }
}
