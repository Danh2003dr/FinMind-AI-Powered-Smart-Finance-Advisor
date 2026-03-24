import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import type { RegisterDto } from '../dto/auth.dto';
import type { LoginDto } from '../dto/auth.dto';
import type { UpdateProfileDto } from '../dto/auth.dto';
import { Category } from '../models/sql/category.entity';
import { Notification } from '../models/sql/notification.entity';
import { User } from '../models/sql/user.entity';

const DEFAULT_CATEGORIES = ['Ăn uống', 'Di chuyển', 'Mua sắm', 'Giải trí', 'Thu nhập'];

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
    @InjectRepository(Notification)
    private readonly notifications: Repository<Notification>,
    private readonly jwt: JwtService,
  ) {}

  private toPublicUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.displayName ?? user.email.split('@')[0],
      phone: user.phone ?? undefined,
    };
  }

  async register(dto: RegisterDto) {
    const exists = await this.users.findOne({ where: { email: dto.email.toLowerCase() } });
    if (exists) {
      throw new ConflictException('Email đã được đăng ký.');
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.users.create({
      email: dto.email.toLowerCase(),
      passwordHash,
      displayName: dto.name?.trim() || null,
      phone: null,
    });
    const saved = await this.users.save(user);

    for (const name of DEFAULT_CATEGORIES) {
      await this.categories.save(this.categories.create({ user: saved, name }));
    }

    await this.notifications.save(
      this.notifications.create({
        user: saved,
        category: 'ai',
        title: 'Chào mừng đến FinMind',
        body: 'Tài khoản đã sẵn sàng. Thêm giao dịch hoặc hỏi AI Advisor.',
        isRead: false,
      }),
    );

    const accessToken = await this.jwt.signAsync({
      sub: saved.id,
      email: saved.email,
    });
    return { accessToken, user: this.toPublicUser(saved) };
  }

  async login(dto: LoginDto) {
    const user = await this.users.findOne({ where: { email: dto.email.toLowerCase() } });
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng.');
    }
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng.');
    }
    const accessToken = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
    });
    return { accessToken, user: this.toPublicUser(user) };
  }

  async getMe(userId: string) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.toPublicUser(user);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException();
    }
    if (dto.displayName !== undefined) {
      user.displayName = dto.displayName.trim() || null;
    }
    if (dto.phone !== undefined) {
      user.phone = dto.phone.trim() || null;
    }
    await this.users.save(user);
    return this.toPublicUser(user);
  }
}
