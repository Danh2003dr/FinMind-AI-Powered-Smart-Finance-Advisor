import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/finance.dto';
import { CurrentUser, type AuthUserPayload } from '../decorators/current-user.decorator';
import { JwtAuthGuard } from '../middlewares/jwt-auth.guard';
import { CategoriesService } from '../services/categories.service';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categories: CategoriesService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUserPayload) {
    return this.categories.findAll(user.userId);
  }

  @Post()
  create(@CurrentUser() user: AuthUserPayload, @Body() dto: CreateCategoryDto) {
    return this.categories.create(user.userId, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categories.update(user.userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthUserPayload, @Param('id', ParseUUIDPipe) id: string) {
    return this.categories.remove(user.userId, id);
  }
}
