import { BaseRepository } from 'src/common/repositories/base.repository';
import { DataSource } from 'typeorm';
import { TransactionEntity } from '../entities/transaction.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';

@Injectable()
export class TransactionRepository extends BaseRepository<TransactionEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, TransactionEntity);
  }

  async update(
    id: string,
    payload: UpdateTransactionDto,
  ): Promise<TransactionEntity> {
    const existingTransaction = await this.repository.findOne({
      where: { id: id },
    });

    if (!existingTransaction) {
      throw new NotFoundException(`Transaction with ID: ${id} not found.`);
    }

    const transaction = await this.repository.save(payload);

    if (!transaction) {
      throw new BadRequestException(
        `ERROR: updating the transacton with ID: ${id}`,
      );
    }

    return transaction;
  }

  async deleteTransaction(id: string): Promise<boolean> {
    const existingTransaction = await this.repository.findOne({
      where: { id: id },
    });

    if (!existingTransaction) {
      throw new NotFoundException(`Transaction with ID: ${id} not found.!`);
    }

    const transaction = await this.repository.remove(existingTransaction);

    if (!transaction) {
      throw new BadRequestException(
        `Error deleting the transaction with ID: ${id}`,
      );
    }

    return true;
  }
}
