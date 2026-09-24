import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { PinoLogger } from 'nestjs-pino';
import { UserDto } from './dtos/user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserByEmailDtoResponse } from './dtos/user-by-email.dto';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private logger: PinoLogger,
  ) {}

  async createUser(input: CreateUserDto): Promise<UserDto> {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: input.email,
      },
    });

    if (existingUser) {
      this.logger.error('create-user-error', {
        msg: `Failed to create user with username: ${input.username}`,
      });
      throw new ConflictException(
        `User with this email: ${input.email} already exists. Try loggin in.`,
      );
    }

    const newUser = await this.userRepository.createAndSave({
      email: input.email,
      username: input.username,
      passwordHash: input.passwordHash,
    });

    if (!newUser) {
      throw new InternalServerErrorException(
        `Error creating user ${input.username}, Please try again.`,
      );
    }

    return new UserDto({
      email: newUser.email,
      id: newUser.id,
      username: newUser.username,
      createdAt: newUser.createdAt,
    });
  }

  async findUserByUsername(input: string): Promise<UserByEmailDtoResponse> {
    const user = await this.userRepository.queryBuilder('users', (qb) =>
      qb
        .addSelect('users.passwordHash')
        .where('users.username = :username', { username: input })
        .getOne(),
    );
    console.log({ user });
    if (!user) {
      throw new NotFoundException(`Erro: User with email: ${input} not found.`);
    }

    return new UserByEmailDtoResponse({
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      passwordHash: user.passwordHash,
    });
  }

  async findUserById(input: string): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: {
        id: input,
      },
    });

    if (!user) {
      throw new NotFoundException(`Erro: User with id: ${input} not found.`);
    }

    return new UserDto({
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async updateUser(id: string, input: UpdateUserDto): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(
        `Error: user with ID: ${input.id} not found.`,
      );
    }

    Object.assign(user, input);
    await this.userRepository.save(user);

    return new UserDto({
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt ?? undefined,
    });
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(`Error: user with ID: ${id} not found.`);
    }

    const isDeletedUser = await this.userRepository.remove(user);

    if (!isDeletedUser) {
      throw new InternalServerErrorException(
        'Error deleting user try again later.',
      );
    }

    return true;
  }

  async deactivateUser(id: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(`Error: user with ID: ${id} not found.`);
    }

    user.isActive = false;
    await this.userRepository.save(user);
  }

  currentUser(@Req() request: Request) {
    console.log('user', request);
  }
}
