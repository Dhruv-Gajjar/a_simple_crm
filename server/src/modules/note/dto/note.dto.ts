import { IsNotEmpty, IsString } from 'class-validator';

export class NoteDto {
  constructor(partial: Partial<NoteDto>) {
    Object.assign(this, partial);
  }

  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;
}
