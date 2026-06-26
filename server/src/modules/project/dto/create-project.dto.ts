import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { PROJECT_STATUS } from '../entities/project.entity';

export class CreateProjectDto {
  constructor(partial: Partial<CreateProjectDto>) {
    Object.assign(this, partial);
  }

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  clientId!: string;

  @IsEnum(PROJECT_STATUS)
  @IsNotEmpty()
  status!: PROJECT_STATUS;

  @IsNumber()
  @IsNotEmpty()
  totalAmount!: number;

  @IsNumber()
  @IsNotEmpty()
  iterations!: number;

  @IsDate()
  @IsNotEmpty()
  startDate!: Date;

  @IsDate()
  @IsNotEmpty()
  endDate!: Date;
}
