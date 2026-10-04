import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { UserDto } from 'src/modules/user/dtos/user.dto';

export class AuthResponseDto {
  constructor(partial: Partial<AuthResponseDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accessToken!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => UserDto)
  user!: UserDto;

  // @ApiProperty()
  // @ValidateNested()
  // @Type(() => WorkspaceDto)
  // workspace!: WorkspaceDto;

  //  // @ApiProperty()
  // @ValidateNested()
  // @Type(() => WorkspaceMemberDto)
  // members!: WorkspaceMemberDto;
}
