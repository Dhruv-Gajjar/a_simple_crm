import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { ClientRepository } from '../client/repositories/client.repository';
import { ProjectRepository } from '../project/repositories/project.repository';
import { TransactionRepository } from '../transaction/repositories/transaction.repository';

@Module({
  controllers: [DashboardController],
  providers: [
    DashboardService,
    ClientRepository,
    ProjectRepository,
    TransactionRepository,
  ],
})
export class DashboardModule {}
