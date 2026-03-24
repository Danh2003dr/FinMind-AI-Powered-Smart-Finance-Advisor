import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { CreateAccountDto } from '../dto/finance.dto';
import type { UpdateAccountDto } from '../dto/finance.dto';
import { Account } from '../models/sql/account.entity';
import { User } from '../models/sql/user.entity';
import { parseMoney, toMoneyString } from '../utils/money';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly repo: Repository<Account>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  private map(a: Account) {
    return {
      id: a.id,
      name: a.name,
      type: a.type,
      balance: parseMoney(a.balance),
      currency: a.currency,
    };
  }

  async findAll(userId: string) {
    const list = await this.repo.find({
      where: { user: { id: userId } },
      order: { name: 'ASC' },
    });
    return list.map((a) => this.map(a));
  }

  async create(userId: string, dto: CreateAccountDto) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User không tồn tại.');
    const row = this.repo.create({
      user,
      name: dto.name.trim(),
      type: dto.type,
      balance: toMoneyString(dto.balance),
      currency: dto.currency ?? 'USD',
    });
    const saved = await this.repo.save(row);
    return this.map(saved);
  }

  async update(userId: string, id: string, dto: UpdateAccountDto) {
    const row = await this.repo.findOne({ where: { id, user: { id: userId } } });
    if (!row) throw new NotFoundException('Tài khoản không tồn tại.');
    if (dto.name !== undefined) row.name = dto.name.trim();
    if (dto.type !== undefined) row.type = dto.type;
    if (dto.balance !== undefined) row.balance = toMoneyString(dto.balance);
    if (dto.currency !== undefined) row.currency = dto.currency;
    await this.repo.save(row);
    return this.map(row);
  }

  async remove(userId: string, id: string) {
    const row = await this.repo.findOne({ where: { id, user: { id: userId } } });
    if (!row) throw new NotFoundException('Tài khoản không tồn tại.');
    await this.repo.remove(row);
    return { ok: true };
  }
}
