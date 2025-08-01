import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  Delete 
} from '@nestjs/common';
import {
  DepositTransactionDto,
  TransferTransactionDto,
  WithdrawTransactionDto,
} from './dto/create-transaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('deposit')
  async deposit(@Body() dto: DepositTransactionDto) {
    return this.transactionService.deposit(dto);
  }

  @Post('withdraw')
  async withdraw(@Body() dto: WithdrawTransactionDto) {
    return this.transactionService.withdraw(dto);
  }

  @Post('transfer')
  async transfer(@Body() dto: TransferTransactionDto) {
    return this.transactionService.transfer(dto);
  }

  @Get()
  async findAll() {
    return this.transactionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}
