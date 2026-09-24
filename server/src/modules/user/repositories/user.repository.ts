import { BaseRepository } from 'src/common/repositories/base.repository';
import { UserEntity } from '../entities/user.entity';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, UserEntity);
  }

  async findUserWithEmailAndPassword(
    email: string,
  ): Promise<UserEntity | null> {
    const user = await this.queryBuilder('users', (qb) =>
      qb
        .addSelect('user.passwordHash')
        .where('user.email := email', { email })
        .getOne(),
    );

    return user;
  }
}
