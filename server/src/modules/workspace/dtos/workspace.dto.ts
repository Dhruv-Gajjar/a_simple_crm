import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ClientEntity } from 'src/modules/client/entities/client.entity';
import { WorkspaceMemberEntity } from 'src/modules/workspace-member/entities/workspace-member.entity';

export class WorkspaceDto {
  constructor(partial: Partial<WorkspaceDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @ApiProperty()
  @IsBoolean()
  isActive!: boolean;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => WorkspaceMemberEntity)
  members!: WorkspaceMemberEntity[];

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => ClientEntity)
  clients!: ClientEntity[];
}
