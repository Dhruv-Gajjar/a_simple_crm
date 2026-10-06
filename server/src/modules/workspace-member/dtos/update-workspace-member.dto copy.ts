import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CreateWorkspaceMemberDto } from './create-workspace-member.dto';

export class UpdateWrorkspaceMemberDto extends PartialType(
  CreateWorkspaceMemberDto,
) {
  @ApiProperty()
  @IsUUID()
  id!: string;
}
