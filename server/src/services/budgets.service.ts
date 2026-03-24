import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { CreateBudgetDto } from '../dto/finance.dto';
import type { UpdateBudgetDto } from '../dto/finance.dto';
import { Budget } from '../models/sql/budget.entity';
import { Transaction } from '../models/sql/transaction.entity';
import { User } from '../models/sql/user.entity';
import { parseMoney, toMoneyString } from '../utils/money';
import { CategoriesService } from './categories.service';

function monthBounds(d = new Date()) {
  const start = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget)
    private readonly repo: Repository<Budget>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(Transaction)
    private readonly txRepo: Repository<Transaction>,
    private readonly categories: CategoriesService,
  ) {}

  private async spentInMonth(
    userId: string,
    categoryId: string | null,
    start: Date,
    end: Date,
  ): Promise<number> {
    if (!categoryId) return 0;
    const raw = await this.txRepo
      .createQueryBuilder('t')
      .select(
        'SUM(CASE WHEN CAST(t.amount AS REAL) < 0 THEN ABS(CAST(t.amount AS REAL)) ELSE 0 END)',
        'spent',
      )
      .where('t.user_id = :uid', { uid: userId })
      .andWhere('t.category_id = :cid', { cid: categoryId })
      .andWhere('t.occurred_at BETWEEN :s AND :e', { s: start, e: end })
      .getRawOne<{ spent: string | null }>();
    const v = raw?.spent != null ? Number.parseFloat(String(raw.spent)) : 0;
    return Number.isFinite(v) ? v : 0;
  }

  private async mapBudget(userId: string, b: Budget) {
    const { start, end } = monthBounds();
    const cap = parseMoney(b.capAmount);
    const spent = await this.spentInMonth(userId, b.category?.id ?? null, start, end);
    const progressPct = cap > 0 ? Math.min(100, Math.round((spent / cap) * 100)) : 0;
    return {
      id: b.id,
      name: b.name,
      subtitle: b.subtitle,
      icon: b.icon,
      capAmount: cap,
      currency: b.currency,
      categoryId: b.category?.id ?? null,
      categoryName: b.category?.name ?? null,
      spentAmount: spent,
      progressPct,
    };
  }

  async findAll(userId: string) {
    const list = await this.repo.find({
      where: { user: { id: userId } },
      relations: ['category'],
      order: { name: 'ASC' },
    });
    return Promise.all(list.map((b) => this.mapBudget(userId, b)));
  }

  async create(userId: string, dto: CreateBudgetDto) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User không tồn tại.');
    let category = null;
    if (dto.categoryId) {
      category = await this.categories.assertOwnsCategory(userId, dto.categoryId);
    }
    const row = this.repo.create({
      user,
      name: dto.name.trim(),
      subtitle: dto.subtitle?.trim() ?? null,
      icon: dto.icon ?? 'category',
      capAmount: toMoneyString(dto.capAmount),
      currency: dto.currency ?? 'VND',
      category,
    });
    const saved = await this.repo.save(row);
    const full = await this.repo.findOne({
      where: { id: saved.id },
      relations: ['category'],
    });
    return this.mapBudget(userId, full!);
  }

  async update(userId: string, id: string, dto: UpdateBudgetDto) {
    const row = await this.repo.findOne({
      where: { id, user: { id: userId } },
      relations: ['category', 'user'],
    });
    if (!row) throw new NotFoundException('Ngân sách không tồn tại.');
    if (dto.name !== undefined) row.name = dto.name.trim();
    if (dto.subtitle !== undefined) row.subtitle = dto.subtitle?.trim() ?? null;
    if (dto.icon !== undefined) row.icon = dto.icon;
    if (dto.capAmount !== undefined) row.capAmount = toMoneyString(dto.capAmount);
    if (dto.currency !== undefined) row.currency = dto.currency;
    if (dto.categoryId !== undefined) {
      if (dto.categoryId === null) {
        row.category = null;
      } else {
        row.category = await this.categories.assertOwnsCategory(userId, dto.categoryId);
      }
    }
    await this.repo.save(row);
    const full = await this.repo.findOne({
      where: { id: row.id },
      relations: ['category'],
    });
    return this.mapBudget(userId, full!);
  }

  async remove(userId: string, id: string) {
    const row = await this.repo.findOne({ where: { id, user: { id: userId } } });
    if (!row) throw new NotFoundException('Ngân sách không tồn tại.');
    await this.repo.remove(row);
    return { ok: true };
  }
}
