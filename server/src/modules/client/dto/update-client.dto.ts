import { PartialType } from '@nestjs/swagger';
import { CreateClientDto } from './create-client.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateClientDto extends PartialType(CreateClientDto) {
  @IsUUID()
  @IsNotEmpty()
  id!: string;
}
