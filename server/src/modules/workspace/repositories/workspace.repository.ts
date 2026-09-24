import { BaseRepository } from 'src/common/repositories/base.repository';
import { DataSource } from 'typeorm';
import { WorkspaceEntity } from '../entities/workspace.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkspaceRepository extends BaseRepository<WorkspaceEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, WorkspaceEntity);
  }
}
