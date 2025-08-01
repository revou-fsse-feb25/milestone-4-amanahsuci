import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './transaction.repository';
import { AccountRepository } from '../accounts/account.repository';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';
import { TransactionStatus, TransactionType } from '@prisma/client';

describe('TransactionService', () => {
  let service: TransactionService;
  let transactionRepository: TransactionRepository;
  let accountRepository: AccountRepository;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: TransactionRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: AccountRepository,
          useValue: {
            findByAccountNumber: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn().mockImplementation((fn) => fn({
              account: {
                update: jest.fn(),
              },
            })),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    transactionRepository = module.get<TransactionRepository>(TransactionRepository);
    accountRepository = module.get<AccountRepository>(AccountRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('deposit', () => {
    it('should create a deposit transaction', async () => {
      const mockAccount = {
        id: 1,
        accountNumber: '123456789',
        balance: new Decimal(1000),
      };

      const dto = {
        receiver_account: '123456789',
        amount: 500,
      };

      const expectedTransaction = {
        id: 1,
        toAccountId: 1,
        amount: 500,
        type: TransactionType.DEPOSIT,
        status: TransactionStatus.COMPLETED,
      };

      (accountRepository.findByAccountNumber as jest.Mock).mockResolvedValue(mockAccount);
      (transactionRepository.create as jest.Mock).mockResolvedValue(expectedTransaction);

      const result = await service.deposit(dto);
      expect(result).toEqual(expectedTransaction);
      expect(transactionRepository.create).toHaveBeenCalledWith({
        toAccountId: mockAccount.id,
        amount: dto.amount,
        type: TransactionType.DEPOSIT,
        status: TransactionStatus.COMPLETED,
      });
    });
  });
});
