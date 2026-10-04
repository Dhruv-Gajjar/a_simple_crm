import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { WorkspaceRole } from '../entities/workspace-member.entity';
import { Type } from 'class-transformer';
import { WorkspaceEntity } from 'src/modules/workspace/entities/workspace.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';

export class CreateWorkspaceMemberDto {
  constructor(partial: Partial<CreateWorkspaceMemberDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  @IsUUID()
  workspaceId!: string;

  @ApiProperty()
  @IsUUID()
  userId!: string;

  @ApiProperty()
  @IsEnum(WorkspaceRole)
  role!: WorkspaceRole;

  @ApiProperty()
  @IsOptional()
  @Type(() => WorkspaceEntity)
  workspace?: WorkspaceEntity;

  @ApiProperty()
  @IsOptional()
  @Type(() => UserEntity)
  user?: UserEntity;
}
