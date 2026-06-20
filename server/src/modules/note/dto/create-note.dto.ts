import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNoteDto {
  constructor(partial: Partial<CreateNoteDto>) {
    Object.assign(this, partial);
  }

  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;
}
