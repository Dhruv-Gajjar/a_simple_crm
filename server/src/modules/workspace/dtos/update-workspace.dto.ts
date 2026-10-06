import { IsUUID } from 'class-validator';
import { CreateWorkspaceDto } from './create-workspace.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateWorkspaceDto extends PartialType(CreateWorkspaceDto) {
  @ApiProperty()
  @IsUUID()
  id!: string;
}
