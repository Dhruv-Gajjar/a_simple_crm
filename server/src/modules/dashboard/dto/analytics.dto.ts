import { Type } from 'class-transformer';
import { IsArray, IsNumber } from 'class-validator';
import { ProjectDto } from 'src/modules/project/dto/project.dto';

export class AnalyticsDto {
  @IsNumber()
  totalActiveClients!: number;

  @IsNumber()
  totalActiveProjects!: number;

  @IsNumber()
  totalEarnings!: number;

  @IsNumber()
  pendingAmount!: number;

  @IsArray()
  @Type(() => ProjectDto)
  activeProjects!: ProjectDto[];
}
