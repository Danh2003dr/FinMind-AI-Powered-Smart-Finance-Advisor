import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'node:path';
import configuration from './config/configuration';
import { DatabaseModule } from './config/database.module';
import { AppRoutesModule } from './routes/app.routes.module';

/** Luôn trỏ tới server/.env (khi chạy từ dist/), không phụ thuộc process.cwd() */
const serverEnvFile = join(__dirname, '..', '.env');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: [
        serverEnvFile,
        join(process.cwd(), '.env'),
        join(process.cwd(), 'server', '.env'),
      ],
    }),
    DatabaseModule.register(),
    AppRoutesModule,
  ],
})
export class AppModule {}
