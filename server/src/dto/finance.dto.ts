import { Type } from 'class-transformer';
import {
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MaxLength(128)
  name!: string;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @MaxLength(128)
  name?: string;
}

export class CreateTransactionDto {
  @IsNumber()
  @Type(() => Number)
  amount!: number;

  @IsString()
  @MaxLength(8)
  currency!: string;

  @IsString()
  @MaxLength(512)
  description!: string;

  @IsISO8601()
  occurredAt!: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(16)
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(16)
  methodType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  methodLabel?: string;
}

export class UpdateTransactionDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  amount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  currency?: string;

  @IsOptional()
  @IsString()
  @MaxLength(512)
  description?: string;

  @IsOptional()
  @IsISO8601()
  occurredAt?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(16)
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(16)
  methodType?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  methodLabel?: string | null;
}

export class ListTransactionQueryDto {
  @IsOptional()
  @IsISO8601()
  from?: string;

  @IsOptional()
  @IsISO8601()
  to?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  q?: string;
}

export class CreateBudgetDto {
  @IsString()
  @MaxLength(128)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(256)
  subtitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  icon?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  capAmount!: number;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  currency?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string | null;
}

export class UpdateBudgetDto {
  @IsOptional()
  @IsString()
  @MaxLength(128)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(256)
  subtitle?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  icon?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  capAmount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  currency?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string | null;
}

export class CreateSavingGoalDto {
  @IsString()
  @MaxLength(256)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(512)
  subtitle?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  targetAmount!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  currentAmount?: number;

  @IsOptional()
  @IsISO8601()
  targetDate?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  icon?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  badge?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  priority?: string;
}

export class UpdateSavingGoalDto {
  @IsOptional()
  @IsString()
  @MaxLength(256)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(512)
  subtitle?: string | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  targetAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  currentAmount?: number;

  @IsOptional()
  @IsISO8601()
  targetDate?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  icon?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  badge?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  priority?: string;
}

export class CreateAccountDto {
  @IsString()
  @MaxLength(128)
  name!: string;

  @IsString()
  @MaxLength(32)
  type!: string;

  @IsNumber()
  @Type(() => Number)
  balance!: number;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  currency?: string;
}

export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  @MaxLength(128)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  type?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  balance?: number;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  currency?: string;
}

export class OcrParseDto {
  @IsString()
  @MaxLength(50_000)
  text!: string;
}
