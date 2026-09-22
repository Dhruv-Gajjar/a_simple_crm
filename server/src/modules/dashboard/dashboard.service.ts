import { Injectable } from '@nestjs/common';
import { ClientRepository } from '../client/repositories/client.repository';
import { ProjectRepository } from '../project/repositories/project.repository';
import { TransactionRepository } from '../transaction/repositories/transaction.repository';
import { ClientDto } from '../client/dto/client.dto';
import { CLIENT_STATUS } from '../client/entities/client.entity';
import { AnalyticsDto } from './dto/analytics.dto';
import { PROJECT_STATUS } from '../project/entities/project.entity';
import { TRANSACTION_STATUS } from '../transaction/entities/transaction.entity';

@Injectable()
export class DashboardService {
  constructor(
    private clientRepository: ClientRepository,
    private projectRepository: ProjectRepository,
    private transactionRepository: TransactionRepository,
  ) {}

  async getDailyLeads(): Promise<ClientDto[]> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return await this.clientRepository.queryBuilder('clients', (qb) =>
      qb
        .where('clients.status = :status', { status: CLIENT_STATUS.Lead })
        .orderBy('clients.status', 'DESC')
        .take(5)
        .getMany(),
    );
  }

  async getDashboardData(): Promise<AnalyticsDto> {
    const activeClients = await this.clientRepository.queryBuilder(
      'clients',
      (qb) =>
        qb
          .where('clients.status = :status', { status: CLIENT_STATUS.Active })
          .getCount(),
    );
    const activeProjects = await this.projectRepository.queryBuilder(
      'projects',
      (qb) =>
        qb
          .leftJoinAndSelect('projects.client', 'clients')
          .where('projects.status = :status', {
            status: PROJECT_STATUS.InProgress,
          })
          .getManyAndCount(),
    );
    const transactionResult = await this.transactionRepository.queryBuilder(
      'transactions',
      (qb) =>
        qb
          .where('transactions.status = :status', {
            status: TRANSACTION_STATUS.Paid,
          })
          .select('SUM(transactions.amount)', 'totalEarnings')
          .getRawOne<{ totalEarnings: number | null }>(),
    );
    const totalEarnigsAmount = transactionResult?.totalEarnings;

    return {
      totalActiveClients: activeClients,
      totalActiveProjects: activeProjects[1],
      pendingAmount: 10000,
      totalEarnings: totalEarnigsAmount ?? 0,
      activeProjects: activeProjects[0],
    };
  }
}
