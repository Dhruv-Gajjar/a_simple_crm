import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { CLIENT_STATUS } from '../entities/client.entity';
import { Type } from 'class-transformer';
import { ProjectEntity } from 'src/modules/project/entities/project.entity';
import { WorkspaceEntity } from 'src/modules/workspace/entities/workspace.entity';

export class CreateClientDto {
  constructor(partial: Partial<CreateClientDto>) {
    Object.assign(this, partial);
  }

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

  @Type(() => ProjectEntity)
  @IsOptional()
  projects!: ProjectEntity[];

  @Type(() => WorkspaceEntity)
  @IsOptional()
  workspace!: WorkspaceEntity;
}
