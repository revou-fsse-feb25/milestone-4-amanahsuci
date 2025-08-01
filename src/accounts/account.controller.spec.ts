import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ForbiddenException } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { TokenPayload } from '../auth/types/auth';

describe('AccountController', () => {
  let controller: AccountController;
  let service: AccountService;

  const mockUser: TokenPayload = {
    sub: 1,
    email: 'test@example.com',
    role: 'customer',
    jti: 'mock-jti',
  };

  const mockAccount = {
    id: 1,
    userId: mockUser.sub,
    accountType: AccountType.CHECKING,
    balance: 1000,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAccountService = {
    create: jest.fn().mockResolvedValue(mockAccount),
    findAll: jest.fn().mockResolvedValue([mockAccount]),
    findByUserId: jest.fn().mockResolvedValue([mockAccount]),
    findById: jest.fn().mockImplementation((id) =>
      id === mockAccount.id ? mockAccount : null,
    ),
    update: jest.fn().mockResolvedValue({ ...mockAccount, balance: 2000 }),
    remove: jest.fn().mockResolvedValue({ message: 'Deleted successfully' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AccountService,
          useValue: mockAccountService,
        },
      ],
    }).compile();

    controller = module.get<AccountController>(AccountController);
    service = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an account', async () => {
    const dto: CreateAccountDto = {
      userId: 1,
      accountType: AccountType.CHECKING,
      balance: 1000,
    };
    const result = await controller.create(dto);
    expect(result).toEqual(mockAccount);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all accounts for admin', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockAccount]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return user accounts', async () => {
    const result = await controller.getAccounts(mockUser);
    expect(result).toEqual([mockAccount]);
    expect(service.findByUserId).toHaveBeenCalledWith(mockUser.sub);
  });

  it('should return account by id if user is owner', async () => {
    const result = await controller.findOne('1', mockUser);
    expect(result).toEqual(mockAccount);
    expect(service.findById).toHaveBeenCalledWith(1);
  });

  it('should throw ForbiddenException if account not found or not owned by user', async () => {
    await expect(controller.findOne('99', mockUser)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should update an account', async () => {
    const dto: UpdateAccountDto = { balance: 2000 };
    const result = await controller.update('1', dto);
    expect(result.balance).toBe(2000);
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should delete an account', async () => {
    const result = await controller.remove('1');
    expect(result).toEqual({ message: 'Deleted successfully' });
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
