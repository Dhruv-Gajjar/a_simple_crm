import { Module } from '@nestjs/common';
import { WorkspaceMemberService } from './workspace-member.service';
import { WorkspaceMemberController } from './workspace-member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceMemberEntity } from './entities/workspace-member.entity';
import { WorkspaceMemberRepository } from './repositories/workspace-members.repository';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceMemberEntity])],
  controllers: [WorkspaceMemberController],
  providers: [WorkspaceMemberService, WorkspaceMemberRepository],
  exports: [WorkspaceMemberService],
})
export class WorkspaceMemberModule {}
