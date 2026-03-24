import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { LoginDto, RegisterDto, UpdateProfileDto } from '../dto/auth.dto';
import { CurrentUser, type AuthUserPayload } from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '../middlewares/jwt-auth.guard';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: AuthUserPayload) {
    return this.auth.getMe(user.userId);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  profile(@CurrentUser() user: AuthUserPayload, @Body() dto: UpdateProfileDto) {
    return this.auth.updateProfile(user.userId, dto);
  }
}
