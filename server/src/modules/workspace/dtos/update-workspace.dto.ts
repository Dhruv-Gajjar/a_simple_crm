import { IsUUID } from 'class-validator';
import { CreateWorkspaceDto } from './create-workspace.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWorkspaceDto extends CreateWorkspaceDto {
  @ApiProperty()
  @IsUUID()
  id!: string;
}
