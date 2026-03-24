import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { CreateSavingGoalDto } from '../dto/finance.dto';
import type { UpdateSavingGoalDto } from '../dto/finance.dto';
import { SavingGoal } from '../models/sql/saving-goal.entity';
import { User } from '../models/sql/user.entity';
import { parseMoney, toMoneyString } from '../utils/money';

@Injectable()
export class SavingGoalsService {
  constructor(
    @InjectRepository(SavingGoal)
    private readonly repo: Repository<SavingGoal>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  private map(g: SavingGoal) {
    const target = parseMoney(g.targetAmount);
    const current = parseMoney(g.currentAmount);
    const progressPct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
    return {
      id: g.id,
      title: g.title,
      subtitle: g.subtitle,
      targetAmount: target,
      currentAmount: current,
      targetDate: g.targetDate?.toISOString() ?? null,
      icon: g.icon,
      badge: g.badge,
      priority: g.priority,
      progressPct,
    };
  }

  async findAll(userId: string) {
    const list = await this.repo.find({
      where: { user: { id: userId } },
      order: { title: 'ASC' },
    });
    return list.map((g) => this.map(g));
  }

  async create(userId: string, dto: CreateSavingGoalDto) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User không tồn tại.');
    const row = this.repo.create({
      user,
      title: dto.title.trim(),
      subtitle: dto.subtitle?.trim() ?? null,
      targetAmount: toMoneyString(dto.targetAmount),
      currentAmount: toMoneyString(dto.currentAmount ?? 0),
      targetDate: dto.targetDate ? new Date(dto.targetDate) : null,
      icon: dto.icon ?? 'flag',
      badge: dto.badge?.trim() ?? null,
      priority: dto.priority ?? 'medium',
    });
    const saved = await this.repo.save(row);
    return this.map(saved);
  }

  async update(userId: string, id: string, dto: UpdateSavingGoalDto) {
    const row = await this.repo.findOne({ where: { id, user: { id: userId } } });
    if (!row) throw new NotFoundException('Mục tiêu không tồn tại.');
    if (dto.title !== undefined) row.title = dto.title.trim();
    if (dto.subtitle !== undefined) row.subtitle = dto.subtitle?.trim() ?? null;
    if (dto.targetAmount !== undefined) row.targetAmount = toMoneyString(dto.targetAmount);
    if (dto.currentAmount !== undefined) row.currentAmount = toMoneyString(dto.currentAmount);
    if (dto.targetDate !== undefined) {
      row.targetDate = dto.targetDate ? new Date(dto.targetDate) : null;
    }
    if (dto.icon !== undefined) row.icon = dto.icon;
    if (dto.badge !== undefined) row.badge = dto.badge?.trim() ?? null;
    if (dto.priority !== undefined) row.priority = dto.priority;
    await this.repo.save(row);
    return this.map(row);
  }

  async remove(userId: string, id: string) {
    const row = await this.repo.findOne({ where: { id, user: { id: userId } } });
    if (!row) throw new NotFoundException('Mục tiêu không tồn tại.');
    await this.repo.remove(row);
    return { ok: true };
  }
}
