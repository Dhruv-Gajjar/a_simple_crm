import { BaseRepository } from 'src/common/repositories/base.repository';
import { ClientEntity } from '../entities/client.entity';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientRepository extends BaseRepository<ClientEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, ClientEntity);
  }
}
