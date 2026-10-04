import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CreateWorkspaceMemberDto } from './create-workspace-member.dto';

export class UpdateWrorkspaceMemberDto extends CreateWorkspaceMemberDto {
  @ApiProperty()
  @IsUUID()
  id!: string;
}
