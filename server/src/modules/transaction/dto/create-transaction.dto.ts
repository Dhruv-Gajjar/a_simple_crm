import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
}
