import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { CreateTransactionDto } from '../dto/finance.dto';
import type { ListTransactionQueryDto } from '../dto/finance.dto';
import type { UpdateTransactionDto } from '../dto/finance.dto';
import { Transaction } from '../models/sql/transaction.entity';
import { User } from '../models/sql/user.entity';
import { parseMoney, toMoneyString } from '../utils/money';
import { CategoriesService } from './categories.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly repo: Repository<Transaction>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly categories: CategoriesService,
  ) {}

  private mapRow(t: Transaction) {
    return {
      id: t.id,
      amount: parseMoney(t.amount),
      currency: t.currency,
      description: t.description,
      occurredAt: t.occurredAt.toISOString(),
      category: t.category?.name,
      categoryId: t.category?.id ?? null,
      status: t.status,
      methodType: t.methodType,
      methodLabel: t.methodLabel,
    };
  }

  async findAll(userId: string, query: ListTransactionQueryDto) {
    const qb = this.repo
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.category', 'c')
      .where('t.user_id = :userId', { userId })
      .orderBy('t.occurred_at', 'DESC');

    if (query.from) {
      qb.andWhere('t.occurred_at >= :from', { from: new Date(query.from) });
    }
    if (query.to) {
      qb.andWhere('t.occurred_at <= :to', { to: new Date(query.to) });
    }
    if (query.q?.trim()) {
      const like = `%${query.q.trim().toLowerCase()}%`;
      qb.andWhere('LOWER(t.description) LIKE :like', { like });
    }

    const rows = await qb.getMany();
    return rows.map((t) => this.mapRow(t));
  }

  async create(userId: string, dto: CreateTransactionDto) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User không tồn tại.');
    let category = null;
    if (dto.categoryId) {
      category = await this.categories.assertOwnsCategory(userId, dto.categoryId);
    }
    const row = this.repo.create({
      user,
      amount: toMoneyString(dto.amount),
      currency: dto.currency,
      description: dto.description,
      occurredAt: new Date(dto.occurredAt),
      category,
      status: dto.status ?? 'completed',
      methodType: dto.methodType ?? null,
      methodLabel: dto.methodLabel ?? null,
    });
    const saved = await this.repo.save(row);
    const full = await this.repo.findOne({
      where: { id: saved.id },
      relations: ['category'],
    });
    return this.mapRow(full!);
  }

  async update(userId: string, id: string, dto: UpdateTransactionDto) {
    const row = await this.repo.findOne({
      where: { id, user: { id: userId } },
      relations: ['category', 'user'],
    });
    if (!row) throw new NotFoundException('Giao dịch không tồn tại.');
    if (dto.amount !== undefined) row.amount = toMoneyString(dto.amount);
    if (dto.currency !== undefined) row.currency = dto.currency;
    if (dto.description !== undefined) row.description = dto.description;
    if (dto.occurredAt !== undefined) row.occurredAt = new Date(dto.occurredAt);
    if (dto.status !== undefined) row.status = dto.status;
    if (dto.methodType !== undefined) row.methodType = dto.methodType;
    if (dto.methodLabel !== undefined) row.methodLabel = dto.methodLabel;
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
    return this.mapRow(full!);
  }

  async remove(userId: string, id: string) {
    const row = await this.repo.findOne({ where: { id, user: { id: userId } } });
    if (!row) throw new NotFoundException('Giao dịch không tồn tại.');
    await this.repo.remove(row);
    return { ok: true };
  }
}
