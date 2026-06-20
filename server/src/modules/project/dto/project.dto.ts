import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PROJECT_STATUS } from '../entities/project.entity';
import { Type } from 'class-transformer';
import { TransactionEntity } from 'src/modules/transaction/entities/transaction.entity';
import { NoteEntity } from 'src/modules/note/entities/note.entity';

export class ProjectDto {
  constructor(partial: Partial<ProjectDto>) {
    Object.assign(this, partial);
  }

  @IsString()
  @IsNotEmpty()
  id!: string;

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

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TransactionEntity)
  transactions?: TransactionEntity[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => NoteEntity)
  notes?: NoteEntity[];
}
