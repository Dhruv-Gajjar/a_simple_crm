import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { WorkspaceMemberEntity } from 'src/modules/workspace-member/entities/workspace-member.entity';

export class UserByEmailDtoResponse {
  constructor(partial: Partial<UserByEmailDtoResponse>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  @IsUUID()
  id!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  passwordHash!: string;

  @ApiProperty()
  @IsString()
  firstName!: string;

  @ApiProperty()
  @IsString()
  lastName!: string;

  @ApiProperty()
  @Type(() => WorkspaceMemberEntity)
  memberships!: WorkspaceMemberEntity[];

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  @IsOptional()
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  @IsOptional()
  updatedAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  @IsOptional()
  deletedAt!: Date;
}
