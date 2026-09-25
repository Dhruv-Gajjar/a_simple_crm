import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class RefreshTokenDto {
  constructor(partial: Partial<RefreshTokenDto>) {
    Object.assign(this, partial);
  }

  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  tokenHash!: string;

  @IsDate()
  @IsNotEmpty()
  expiresAt!: Date;
}
