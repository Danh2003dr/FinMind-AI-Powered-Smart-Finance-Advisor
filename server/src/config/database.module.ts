import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm';
import { isAbsolute, join } from 'node:path';
import { AiLog, AiLogSchema } from '../models/nosql/ai-log.schema';
import {
  ReceiptMetadata,
  ReceiptMetadataSchema,
} from '../models/nosql/receipt-metadata.schema';
import { TYPEORM_ENTITIES } from './typeorm.entities';

function useMongo(): boolean {
  if (process.env.SKIP_DB === 'true') return false;
  if ((process.env.DB_DRIVER ?? 'sqlite').toLowerCase() !== 'mssql') return false;
  return process.env.MONGODB_ENABLED === 'true';
}

@Module({})
export class DatabaseModule {
  static register(): DynamicModule {
    const mongoOn = useMongo();

    const imports: DynamicModule['imports'] = [
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService): TypeOrmModuleOptions => {
          const skip = config.get<boolean>('database.skip');
          const entities = TYPEORM_ENTITIES;
          const isDev = config.get<string>('nodeEnv') === 'development';

          if (skip) {
            return {
              type: 'better-sqlite3',
              database: ':memory:',
              entities,
              synchronize: true,
              logging: isDev,
            };
          }

          const driver = config.get<string>('database.driver', 'sqlite');
          if (driver === 'mssql') {
            return {
              type: 'mssql',
              host: config.getOrThrow<string>('database.sql.host'),
              port: config.getOrThrow<number>('database.sql.port'),
              username: config.getOrThrow<string>('database.sql.username'),
              password: config.getOrThrow<string>('database.sql.password'),
              database: config.getOrThrow<string>('database.sql.database'),
              options: {
                encrypt: config.get<boolean>('database.sql.encrypt', true),
                trustServerCertificate: config.get<boolean>(
                  'database.sql.trustServerCertificate',
                  true,
                ),
              },
              entities,
              synchronize: config.get<boolean>('database.sql.synchronize', false),
              logging: isDev,
            };
          }

          const rel = config.get<string>('database.sqlite.path', 'data/finmind.sqlite');
          const database = isAbsolute(rel) ? rel : join(process.cwd(), rel);
          return {
            type: 'better-sqlite3',
            database,
            entities,
            synchronize: config.get<boolean>('database.sqlite.synchronize', true),
            logging: isDev,
          };
        },
      }),
    ];

    const exports: DynamicModule['exports'] = [TypeOrmModule];

    if (mongoOn) {
      imports.push(
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            uri: config.getOrThrow<string>('database.mongo.uri'),
          }),
        }),
        MongooseModule.forFeature([
          { name: AiLog.name, schema: AiLogSchema },
          { name: ReceiptMetadata.name, schema: ReceiptMetadataSchema },
        ]),
      );
      exports.push(MongooseModule);
    }

    return {
      module: DatabaseModule,
      imports,
      exports,
    };
  }
}
