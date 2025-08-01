import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

describe('AccountService', () => {
  let service: AccountService;
  let prisma: PrismaService;

  const mockAccount = {
    id: 1,
    accountNumber: '1234567890',
    userId: 1,
    accountType: AccountType.CHECKING,
    balance: new Decimal(1000),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const prismaMock = {
    account: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should create an account', async () => {
    prismaMock.account.create.mockResolvedValue(mockAccount);

    const dto = {
      userId: 1,
      accountType: AccountType.CHECKING,
      balance: 1000,
    };

    const result = await service.create(dto);
    expect(prismaMock.account.create).toHaveBeenCalled();
    expect(result).toEqual(mockAccount);
  });

  it('should return all accounts', async () => {
    prismaMock.account.findMany.mockResolvedValue([mockAccount]);

    const result = await service.findAll();
    expect(prismaMock.account.findMany).toHaveBeenCalledWith({
      include: { user: true },
    });
    expect(result).toEqual([mockAccount]);
  });

  it('should return an account by ID', async () => {
    prismaMock.account.findUnique.mockResolvedValue(mockAccount);

    const result = await service.findById(1);
    expect(result).toEqual(mockAccount);
  });

  it('should return null if account by ID not found', async () => {
    prismaMock.account.findUnique.mockResolvedValue(null);

    const result = await service.findById(999);
    expect(result).toBeNull();
  });

  it('should return accounts by user ID', async () => {
    prismaMock.account.findMany.mockResolvedValue([mockAccount]);

    const result = await service.findByUserId(1);
    expect(result).toEqual([mockAccount]);
  });

  it('should update an account', async () => {
    prismaMock.account.findUnique.mockResolvedValue(mockAccount);

    const updatedAccount = {
      ...mockAccount,
      balance: new Decimal(2000),
    };
    prismaMock.account.update.mockResolvedValue(updatedAccount);

    const result = await service.update(1, { balance: 2000 });

    expect(new Decimal(result.balance).toNumber()).toBe(2000);
  });

  it('should throw NotFoundException on update if not found', async () => {
    prismaMock.account.findUnique.mockResolvedValue(null);

    await expect(
      service.update(99, { balance: 2000 }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should delete an account', async () => {
    prismaMock.account.findUnique.mockResolvedValue(mockAccount);
    prismaMock.account.delete.mockResolvedValue(mockAccount);

    const result = await service.remove(1);
    expect(result).toEqual(mockAccount);
  });

  it('should throw NotFoundException on delete if not found', async () => {
    prismaMock.account.findUnique.mockResolvedValue(null);

    await expect(service.remove(99)).rejects.toThrow(NotFoundException);
  });

  it('should update account balance', async () => {
    const updatedAccount = {
      ...mockAccount,
      balance: new Decimal(3000),
    };

    prismaMock.account.update.mockResolvedValue(updatedAccount);

    const result = await service.updateBalance(1, 3000);
    expect(new Decimal(result.balance).toNumber()).toBe(3000);
  });
});
