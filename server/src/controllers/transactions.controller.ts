import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  CreateTransactionDto,
  ListTransactionQueryDto,
  UpdateTransactionDto,
} from '../dto/finance.dto';
import { CurrentUser, type AuthUserPayload } from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '../middlewares/jwt-auth.guard';
import { TransactionsService } from '../services/transactions.service';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactions: TransactionsService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUserPayload, @Query() query: ListTransactionQueryDto) {
    return this.transactions.findAll(user.userId, query);
  }

  @Post()
  create(@CurrentUser() user: AuthUserPayload, @Body() dto: CreateTransactionDto) {
    return this.transactions.create(user.userId, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.transactions.update(user.userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthUserPayload, @Param('id', ParseUUIDPipe) id: string) {
    return this.transactions.remove(user.userId, id);
  }
}
