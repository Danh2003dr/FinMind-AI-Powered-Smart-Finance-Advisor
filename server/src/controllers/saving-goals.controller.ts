import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateSavingGoalDto, UpdateSavingGoalDto } from '../dto/finance.dto';
import { CurrentUser, type AuthUserPayload } from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '../middlewares/jwt-auth.guard';
import { SavingGoalsService } from '../services/saving-goals.service';

@Controller('saving-goals')
@UseGuards(JwtAuthGuard)
export class SavingGoalsController {
  constructor(private readonly goals: SavingGoalsService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUserPayload) {
    return this.goals.findAll(user.userId);
  }

  @Post()
  create(@CurrentUser() user: AuthUserPayload, @Body() dto: CreateSavingGoalDto) {
    return this.goals.create(user.userId, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSavingGoalDto,
  ) {
    return this.goals.update(user.userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthUserPayload, @Param('id', ParseUUIDPipe) id: string) {
    return this.goals.remove(user.userId, id);
  }
}
