import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import {
  DepositTransactionDto,
  WithdrawTransactionDto,
  TransferTransactionDto,
} from './dto/create-transaction.dto';

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;

  const mockTransactionService = {
    deposit: jest.fn(),
    withdraw: jest.fn(),
    transfer: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get<TransactionService>(TransactionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('deposit', () => {
    it('should call service.deposit with dto', async () => {
      const dto: DepositTransactionDto = {
        amount: 1000,
        receiver_account: 'ACC123456',
        additional_info: {
          note: 'Initial deposit',
        },
      };
      const result = { success: true };
      mockTransactionService.deposit.mockResolvedValue(result);

      expect(await controller.deposit(dto)).toEqual(result);
      expect(service.deposit).toHaveBeenCalledWith(dto);
    });
  });

  describe('withdraw', () => {
    it('should call service.withdraw with dto', async () => {
      const dto: WithdrawTransactionDto = {
        amount: 500,
        sender_account: 'ACC123456',
        description: 'Cash withdrawal',
        additional_info: {
          note: 'ATM',
        },
      };
      const result = { success: true };
      mockTransactionService.withdraw.mockResolvedValue(result);

      expect(await controller.withdraw(dto)).toEqual(result);
      expect(service.withdraw).toHaveBeenCalledWith(dto);
    });
  });

  describe('transfer', () => {
    it('should call service.transfer with dto', async () => {
      const dto: TransferTransactionDto = {
        amount: 200,
        sender_account: 'ACC000111',
        receiver_account: 'ACC222333',
        balance: 1000,
        description: 'Monthly payment',
        additional_info: {
          note: 'Transfer via app',
        },
      };
      const result = { success: true };
      mockTransactionService.transfer.mockResolvedValue(result);

      expect(await controller.transfer(dto)).toEqual(result);
      expect(service.transfer).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all transactions', async () => {
      const result = [{ id: 1 }, { id: 2 }];
      mockTransactionService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one transaction by id', async () => {
      const result = { id: 1 };
      mockTransactionService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual(result);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('remove', () => {
    it('should delete transaction by id', async () => {
      const result = { success: true };
      mockTransactionService.remove.mockResolvedValue(result);

      expect(await controller.remove('1')).toEqual(result);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
