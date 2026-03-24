import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../models/sql/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly repo: Repository<Notification>,
  ) {}

  private map(n: Notification) {
    return {
      id: n.id,
      category: n.category,
      title: n.title,
      body: n.body,
      isRead: n.isRead,
      createdAt: n.createdAt.toISOString(),
    };
  }

  async findAll(userId: string) {
    const list = await this.repo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
    return list.map((n) => this.map(n));
  }

  async markRead(userId: string, id: string) {
    const row = await this.repo.findOne({ where: { id, user: { id: userId } } });
    if (!row) throw new NotFoundException('Thông báo không tồn tại.');
    row.isRead = true;
    await this.repo.save(row);
    return this.map(row);
  }

  async remove(userId: string, id: string) {
    const row = await this.repo.findOne({ where: { id, user: { id: userId } } });
    if (!row) throw new NotFoundException('Thông báo không tồn tại.');
    await this.repo.remove(row);
    return { ok: true };
  }
}
