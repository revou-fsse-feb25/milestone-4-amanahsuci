import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { AccountRepository } from '../accounts/account.repository';
import {
  DepositTransactionDto,
  TransferTransactionDto,
  WithdrawTransactionDto,
} from './dto/create-transaction.dto';
import { TransactionStatus, TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  async deposit(dto: DepositTransactionDto) {
    const { receiver_account, amount } = dto;

    const toAccount = await this.accountRepository.findByAccountNumber(receiver_account);
    if (!toAccount) throw new NotFoundException('Receiver account not found');

    return this.prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: { id: toAccount.id },
        data: { balance: toAccount.balance.plus(amount) },
      });

      return this.transactionRepository.create({
        toAccountId: toAccount.id,
        amount,
        type: TransactionType.DEPOSIT,
        status: TransactionStatus.COMPLETED,
      });
    });
  }

  async withdraw(dto: WithdrawTransactionDto) {
    const { sender_account, amount, description } = dto;

    const fromAccount = await this.accountRepository.findByAccountNumber(sender_account);
    if (!fromAccount) throw new NotFoundException('Sender account not found');
    if (fromAccount.balance.lt(amount)) throw new BadRequestException('Insufficient balance');

    return this.prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: { id: fromAccount.id },
        data: { balance: Number(fromAccount.balance) - amount },
      });

      return this.transactionRepository.create({
        fromAccountId: fromAccount.id,
        amount,
        type: TransactionType.WITHDRAW,
        status: TransactionStatus.COMPLETED,
        description,
      });
    });
  }

  async transfer(dto: TransferTransactionDto) {
    const { sender_account, receiver_account, amount, description } = dto;

    const fromAccount = await this.accountRepository.findByAccountNumber(sender_account);
    const toAccount = await this.accountRepository.findByAccountNumber(receiver_account);

    if (!fromAccount || !toAccount) {
      throw new NotFoundException('One or both accounts not found');
    }

    if (fromAccount.balance.lt(amount)) {
      throw new BadRequestException('Insufficient balance');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: { id: fromAccount.id },
        data: { balance: Number(fromAccount.balance) - amount },
      });

      await tx.account.update({
        where: { id: toAccount.id },
        data: { balance: toAccount.balance.plus(amount) },
      });

      return this.transactionRepository.create({
        fromAccountId: fromAccount.id,
        toAccountId: toAccount.id,
        amount,
        type: TransactionType.TRANSFER,
        status: TransactionStatus.COMPLETED,
        description,
      });
    });
  }

  async findAll() {
    return this.transactionRepository.findAll();
  }

  async findOne(id: number) {
    const trx = await this.transactionRepository.findById(id);
    if (!trx) throw new NotFoundException('Transaction not found');
    return trx;
  }

  async remove(id: number) {
    const trx = await this.transactionRepository.findById(id);
    if (!trx) throw new NotFoundException('Transaction not found');

    return this.transactionRepository.delete(id);
  }
}
