import { Injectable } from '@nestjs/common';
import {
  DataSource,
  DeepPartial,
  EntityTarget,
  FindManyOptions,
  ObjectLiteral,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

import { BaseEntity } from '../entities/base.entity';

@Injectable()
export abstract class BaseRepository<T extends BaseEntity & ObjectLiteral> {
  protected readonly repository: Repository<T>;

  protected constructor(
    protected readonly dataSource: DataSource,
    private readonly entity: EntityTarget<T>,
  ) {
    this.repository = this.dataSource.getRepository(this.entity);
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async findOne(options: FindManyOptions<T>): Promise<T | null> {
    return this.repository.findOne(options);
  }

  async createAndSave(payload: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(payload);
    return this.repository.save(entity);
  }

  async save(entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  async remove(entity: T): Promise<T> {
    return this.repository.remove(entity);
  }

  async query<R = any>(sql: string, parameters?: any[]): Promise<R> {
    return this.repository.query(sql, parameters);
  }

  async queryBuilder<R>(
    alias: string,
    builderFn: (qb: SelectQueryBuilder<T>) => Promise<R>,
  ): Promise<R> {
    const qb = this.repository.createQueryBuilder(alias);
    return builderFn(qb);
  }

  async queryBuilderWithPagination(
    alias: string,
    page: number = 1,
    limit: number = 10,
    builderFn?: (qb: SelectQueryBuilder<T>) => SelectQueryBuilder<T>,
  ): Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    let qb = this.repository.createQueryBuilder(alias);

    if (builderFn) {
      qb = builderFn(qb);
    }

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async transactions<R>(
    operations: (manager: QueryRunner['manager']) => Promise<R>,
  ): Promise<R> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await operations(queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
