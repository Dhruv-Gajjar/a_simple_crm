import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTransactionDto } from './create-transaction.dto';
import { IsUUID } from 'class-validator';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @ApiProperty()
  @IsUUID()
  id!: string;
}
