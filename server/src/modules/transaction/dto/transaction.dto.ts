import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TRANSACTION_STATUS } from '../entities/transaction.entity';
import { ProjectEntity } from 'src/modules/project/entities/project.entity';
import { Type } from 'class-transformer';

export class TransactionDto {
  constructor(partial: Partial<TransactionDto>) {
    Object.assign(this, partial);
  }

  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProjectEntity)
  project?: ProjectEntity;

  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @IsString()
  @IsNotEmpty()
  paymentMethod!: string;

  @IsDate()
  @IsNotEmpty()
  paymentDate!: Date;

  @IsEnum(TRANSACTION_STATUS)
  @IsNotEmpty()
  status!: TRANSACTION_STATUS;
}
