import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, isAbsolute, join } from 'node:path';
import { AppModule } from './app';
import { HttpExceptionFilter } from './middlewares/http-exception.filter';

function ensureSqliteParentDir() {
  if (process.env.SKIP_DB === 'true') return;
  if ((process.env.DB_DRIVER ?? 'sqlite').toLowerCase() !== 'sqlite') return;
  const rel = process.env.SQLITE_PATH ?? 'data/finmind.sqlite';
  const full = isAbsolute(rel) ? rel : join(process.cwd(), rel);
  const dir = dirname(full);
  if (dir && !existsSync(dir)) mkdirSync(dir, { recursive: true });
}

async function bootstrap() {
  ensureSqliteParentDir();
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
}
void bootstrap();
