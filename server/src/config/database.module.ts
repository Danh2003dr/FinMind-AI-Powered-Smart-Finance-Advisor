import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiLog, AiLogSchema } from '../models/nosql/ai-log.schema';
import {
  ReceiptMetadata,
  ReceiptMetadataSchema,
} from '../models/nosql/receipt-metadata.schema';
import { Category } from '../models/sql/category.entity';
import { Transaction } from '../models/sql/transaction.entity';
import { User } from '../models/sql/user.entity';

function useDatabase(): boolean {
  return process.env.SKIP_DB === 'false';
}

@Module({})
export class DatabaseModule {
  static register(): DynamicModule {
    if (!useDatabase()) {
      return { module: DatabaseModule, imports: [], exports: [] };
    }

    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            type: 'mssql' as const,
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
            entities: [User, Transaction, Category],
            synchronize: config.get<boolean>('database.sql.synchronize', false),
            logging: config.get<string>('nodeEnv') === 'development',
          }),
        }),
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
      ],
      exports: [TypeOrmModule, MongooseModule],
    };
  }
}
