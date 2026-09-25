import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiResponse } from '@nestjs/swagger';
import { UserDto } from './dtos/user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'User with email found.',
  })
  @UseGuards(JwtAuthGuard)
  async findByUsername(@Body() input: string): Promise<UserDto> {
    const user = await this.userService.findUserByUsername(input);

    return user;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getUserProfile(@Req() request: Request): string {
    console.log('user', (request as any).user);
    return 'Acces Granted';
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'User found.',
  })
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string): Promise<UserDto> {
    const user = await this.userService.findUserById(id);

    if (!user) {
      throw new InternalServerErrorException(
        `Error: Failed to find user with id: ${id}.`,
      );
    }

    return user;
  }

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Sucessfully created new user.',
  })
  async createUser(@Body() input: CreateUserDto): Promise<UserDto> {
    const newUser = await this.userService.createUser(input);

    if (!newUser) {
      throw new InternalServerErrorException(
        `Error: Failed to create user with ${input.username}, please try again.`,
      );
    }

    return newUser;
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Sucessfully created new user.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  async updateUser(
    @Param('id') id: string,
    @Body() input: UpdateUserDto,
  ): Promise<UserDto> {
    const user = await this.userService.updateUser(id, input);

    if (!user) {
      throw new InternalServerErrorException(
        `Error: Failed to find user with id: ${id}.`,
      );
    }

    return user;
  }
}
