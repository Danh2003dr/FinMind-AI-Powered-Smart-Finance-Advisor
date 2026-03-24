import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { CreateCategoryDto } from '../dto/finance.dto';
import type { UpdateCategoryDto } from '../dto/finance.dto';
import { Category } from '../models/sql/category.entity';
import { User } from '../models/sql/user.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async findAll(userId: string) {
    const list = await this.repo.find({
      where: { user: { id: userId } },
      order: { name: 'ASC' },
    });
    return list.map((c) => ({ id: c.id, name: c.name }));
  }

  async create(userId: string, dto: CreateCategoryDto) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User không tồn tại.');
    const row = this.repo.create({ user, name: dto.name.trim() });
    const saved = await this.repo.save(row);
    return { id: saved.id, name: saved.name };
  }

  async update(userId: string, id: string, dto: UpdateCategoryDto) {
    const row = await this.repo.findOne({
      where: { id, user: { id: userId } },
      relations: ['user'],
    });
    if (!row) throw new NotFoundException('Danh mục không tồn tại.');
    if (dto.name !== undefined) row.name = dto.name.trim();
    await this.repo.save(row);
    return { id: row.id, name: row.name };
  }

  async remove(userId: string, id: string) {
    const row = await this.repo.findOne({ where: { id, user: { id: userId } } });
    if (!row) throw new NotFoundException('Danh mục không tồn tại.');
    await this.repo.remove(row);
    return { ok: true };
  }

  async assertOwnsCategory(userId: string, categoryId: string) {
    const c = await this.repo.findOne({
      where: { id: categoryId, user: { id: userId } },
    });
    if (!c) throw new NotFoundException('Danh mục không hợp lệ.');
    return c;
  }
}
