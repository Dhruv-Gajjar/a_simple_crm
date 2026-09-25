import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateRefresTokenDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  rawToken!: string;
}
