import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { CLIENT_STATUS } from '../entities/client.entity';
import { Type } from 'class-transformer';
import { ProjectDto } from 'src/modules/project/dto/project.dto';

export class ClientDto {
  constructor(partial: Partial<ClientDto>) {
    Object.assign(this, partial);
  }

  @IsString()
  @IsNotEmpty()
  id!: string;

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
  remarks!: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProjectDto)
  projects?: ProjectDto[];
}
