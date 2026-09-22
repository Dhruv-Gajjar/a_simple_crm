import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { TRANSACTION_STATUS } from '../entities/transaction.entity';

export class CreateTransactionDto {
  constructor(partial: Partial<CreateTransactionDto>) {
    Object.assign(this, partial);
  }

  @IsString()
  @IsNotEmpty()
  projectId!: string;

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
