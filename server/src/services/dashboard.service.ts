import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../models/sql/account.entity';
import { Transaction } from '../models/sql/transaction.entity';
import { parseMoney } from '../utils/money';

function monthBounds(d = new Date()) {
  const start = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Account)
    private readonly accounts: Repository<Account>,
    @InjectRepository(Transaction)
    private readonly txRepo: Repository<Transaction>,
  ) {}

  async summary(userId: string) {
    const accs = await this.accounts.find({ where: { user: { id: userId } } });
    let currentBalance = 0;
    for (const a of accs) {
      currentBalance += parseMoney(a.balance);
    }

    const { start, end } = monthBounds();

    const incomeRaw = await this.txRepo
      .createQueryBuilder('t')
      .select('SUM(CASE WHEN CAST(t.amount AS REAL) > 0 THEN CAST(t.amount AS REAL) ELSE 0 END)', 'v')
      .where('t.user_id = :uid', { uid: userId })
      .andWhere('t.occurred_at BETWEEN :s AND :e', { s: start, e: end })
      .getRawOne<{ v: string | null }>();
    const totalIncome = incomeRaw?.v != null ? Number.parseFloat(String(incomeRaw.v)) : 0;

    const expenseRaw = await this.txRepo
      .createQueryBuilder('t')
      .select(
        'SUM(CASE WHEN CAST(t.amount AS REAL) < 0 THEN ABS(CAST(t.amount AS REAL)) ELSE 0 END)',
        'v',
      )
      .where('t.user_id = :uid', { uid: userId })
      .andWhere('t.occurred_at BETWEEN :s AND :e', { s: start, e: end })
      .getRawOne<{ v: string | null }>();
    const totalExpense = expenseRaw?.v != null ? Number.parseFloat(String(expenseRaw.v)) : 0;

    const rows = await this.txRepo.find({
      where: { user: { id: userId } },
      relations: ['category'],
      order: { occurredAt: 'DESC' },
      take: 5,
    });
    const recentTransactions = rows.map((t) => ({
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
    }));

    return {
      currentBalance,
      totalIncome: Number.isFinite(totalIncome) ? totalIncome : 0,
      totalExpense: Number.isFinite(totalExpense) ? totalExpense : 0,
      recentTransactions,
    };
  }
}
