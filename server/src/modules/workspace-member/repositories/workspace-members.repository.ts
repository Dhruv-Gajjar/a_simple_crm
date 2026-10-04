import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { DataSource } from 'typeorm';
import { WorkspaceMemberEntity } from '../entities/workspace-member.entity';

@Injectable()
export class WorkspaceMemberRepository extends BaseRepository<WorkspaceMemberEntity> {
  constructor(dataSoruce: DataSource) {
    super(dataSoruce, WorkspaceMemberEntity);
  }
}
