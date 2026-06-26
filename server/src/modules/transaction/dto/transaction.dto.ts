import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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

  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @IsString()
  @IsNotEmpty()
  paymentMethod!: string;

  @IsDate()
  @IsNotEmpty()
  paymentDate!: Date;
}
