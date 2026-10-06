import { PartialType } from '@nestjs/swagger';
import { CreateClientDto } from './create-client.dto';
import { IsUUID } from 'class-validator';

export class UpdateClientDto extends PartialType(CreateClientDto) {
  @IsUUID()
  id!: string;
}
