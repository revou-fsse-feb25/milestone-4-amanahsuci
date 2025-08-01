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
import { RolesGuard } from '../auth/guards/roles.guards';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TokenPayload } from '../auth/types/auth';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Accounts')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new account' })
  @ApiResponse({ status: 201, description: 'The account has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Bad request.' })
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all accounts' })
  @ApiResponse({ status: 200, description: 'Returns all accounts.' })
  @ApiResponse({ status: 403, description: 'Forbidden! Only admin can acces this route' })
  findAll() {
    return this.accountService.findAll();
  }

  @Get('my-accounts')
  @ApiOperation({ summary: 'Get accounts for the logged-in user' })
  @ApiResponse({ status: 200, description: 'List of user accounts' })
  getAccounts(@CurrentUser() user: TokenPayload) {
    return this.accountService.findByUserId(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get account by ID (only owner can access)' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Account details' })
  @ApiResponse({ status: 403, description: 'Forbidden or not found' })
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
  @ApiOperation({ summary: 'Update an account by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Account updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(+id, updateAccountDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an account by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Account deleted successfully' })
  remove(@Param('id') id: string) {
    return this.accountService.remove(+id);
  }
}

