import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionRepository } from './repositories/transaction.repository';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class TransactionService {
  constructor(
    private transactionRepository: TransactionRepository,
    private logger: PinoLogger,
  ) {}

  async create(
    workspaceId: string,
    payload: CreateTransactionDto,
  ): Promise<TransactionEntity> {
    const newTransaction = await this.transactionRepository.createAndSave({
      workspaceId: workspaceId,
      projectId: payload.projectId,
      amount: payload.amount,
      paymentMethod: payload.paymentMethod,
      paymentDate: payload.paymentDate,
      status: payload.status,
    });

    if (!newTransaction) {
      this.logger.warn('Failed to create transaction.');
      throw new BadRequestException(`Failed to create transaction.`);
    }

    this.logger.info(
      { type: payload.paymentMethod },
      `Created new transaction.`,
    );

    return newTransaction;
  }

  async findAll(workspaceId: string): Promise<TransactionEntity[]> {
    const transactions = await this.transactionRepository.findAll({
      relations: {
        project: true,
      },
      where: {
        workspaceId: workspaceId,
      },
    });

    if (!transactions) {
      this.logger.warn('Failed to get all transactions.');
      throw new BadRequestException(`Failed to get all transactions`);
    }

    return transactions;
  }

  async findOne(id: string, workspaceId: string): Promise<TransactionEntity> {
    const transaction = await this.transactionRepository.findOne({
      relations: {
        project: {
          client: true,
        },
      },
      where: { id: id, workspaceId: workspaceId },
    });

    if (!transaction) {
      this.logger.warn({ id: id }, `Transaction with ID: ${id} not found.`);
      throw new NotFoundException(`Transaction with ID: ${id} not found.`);
    }

    return transaction;
  }

  async update(
    id: string,
    workspaceId: string,
    payload: UpdateTransactionDto,
  ): Promise<TransactionEntity> {
    const transaction = await this.transactionRepository.update(
      id,
      workspaceId,
      payload,
    );

    if (!transaction) {
      this.logger.warn(
        { id: id },
        `ERROR: updating transaction with ID: ${id}`,
      );
      throw new BadRequestException(`Failed to update transaction.`);
    }

    return transaction;
  }

  async remove(id: string, workspaceId: string): Promise<boolean> {
    const isDeleated = await this.transactionRepository.deleteTransaction(
      id,
      workspaceId,
    );

    if (!isDeleated) {
      this.logger.warn(
        { id: id },
        `ERROR: Deleating transaction with ID: ${id}`,
      );
      throw new BadRequestException(`Failed to delete transaction.`);
    }

    return isDeleated;
  }
}
