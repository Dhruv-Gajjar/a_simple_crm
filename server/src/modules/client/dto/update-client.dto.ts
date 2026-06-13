import { PartialType } from '@nestjs/swagger';
import { CreateClientDto } from './create-client.dto';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { CLIENT_STATUS } from '../entities/client.entity';

export class UpdateClientDto extends PartialType(CreateClientDto) {
  @IsString()
  @IsNotEmpty()
  @Length(4, 50)
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  source!: string;

  @IsEnum(CLIENT_STATUS)
  @IsNotEmpty()
  status!: CLIENT_STATUS;

  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;

  @IsString()
  @IsOptional()
  remakrs!: string;
}
