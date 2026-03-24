import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateAccountDto, UpdateAccountDto } from '../dto/finance.dto';
import { CurrentUser, type AuthUserPayload } from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '../middlewares/jwt-auth.guard';
import { AccountsService } from '../services/accounts.service';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private readonly accounts: AccountsService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUserPayload) {
    return this.accounts.findAll(user.userId);
  }

  @Post()
  create(@CurrentUser() user: AuthUserPayload, @Body() dto: CreateAccountDto) {
    return this.accounts.create(user.userId, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAccountDto,
  ) {
    return this.accounts.update(user.userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthUserPayload, @Param('id', ParseUUIDPipe) id: string) {
    return this.accounts.remove(user.userId, id);
  }
}
