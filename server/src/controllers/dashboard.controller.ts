import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser, type AuthUserPayload } from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '../middlewares/jwt-auth.guard';
import { DashboardService } from '../services/dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get('summary')
  summary(@CurrentUser() user: AuthUserPayload) {
    return this.dashboard.summary(user.userId);
  }
}
