import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';
import { IsUUID } from 'class-validator';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @ApiProperty()
  @IsUUID()
  id!: string;
}
