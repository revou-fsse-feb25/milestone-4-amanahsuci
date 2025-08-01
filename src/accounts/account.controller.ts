import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { TokenPayload } from 'src/auth/types/auth';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }

  @Get()
  @Roles('admin') 
  findAll() {
    return this.accountService.findAll();
  }

  @Get('my-accounts')
  getAccounts(@CurrentUser() user: TokenPayload) {
    return this.accountService.findByUserId(user.sub);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: TokenPayload,
  ) {
    const account = await this.accountService.findById(+id);

    if (!account || account.userId !== user.sub) {
      throw new ForbiddenException('Access denied or account not found');
    }

    return account;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(+id, updateAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountService.remove(+id);
  }
}

