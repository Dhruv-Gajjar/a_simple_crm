import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionDto } from './dto/transaction.dto';
import { PinoLogger } from 'nestjs-pino';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransactionEntity } from './entities/transaction.entity';
import { WorkspaceGuard } from 'src/common/guards/workspace.guard';
import { CurrentWorkspaceId } from 'src/common/decorators/current-workspace.decorator';

@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private logger: PinoLogger,
  ) {}

  @Post()
  @UseGuards(WorkspaceGuard)
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({ status: 201, description: 'Transaction created successfully' })
  @ApiResponse({ status: 400, description: 'Failed to create transaction' })
  async create(
    @CurrentWorkspaceId() workspaceId: string,
    @Body() payload: CreateTransactionDto,
  ): Promise<TransactionDto> {
    const transaction = await this.transactionService.create(
      workspaceId,
      payload,
    );

    if (!transaction) {
      this.logger.warn(`Failed to create new transaction.`);
      throw new BadRequestException(
        `ERROR: Failed to create new transaction, try again.`,
      );
    }

    return new TransactionDto({
      projectId: transaction.projectId,
      amount: transaction.amount,
      paymentMethod: transaction.paymentMethod,
      paymentDate: transaction.paymentDate,
      status: transaction.status,
    });
  }

  @Get()
  @UseGuards(WorkspaceGuard)
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({
    status: 200,
    description: 'All transactions fetch sucessfully',
  })
  @ApiResponse({ status: 400, description: 'Failed to get all transactions' })
  async findAll(
    @CurrentWorkspaceId() workspaceId: string,
  ): Promise<TransactionDto[]> {
    const transactions = await this.transactionService.findAll(workspaceId);

    if (!transactions) {
      this.logger.warn(
        { action: 'getAllTransactions' },
        'Failed to fetch all transactions.',
      );
      throw new InternalServerErrorException(
        `ERROR: Failed to get all transactions`,
      );
    }

    return transactions.map(
      (transaction: TransactionEntity) =>
        new TransactionDto({
          id: transaction.id,
          projectId: transaction.projectId,
          project: transaction.project,
          amount: transaction.amount,
          paymentMethod: transaction.paymentMethod,
          paymentDate: transaction.paymentDate,
          status: transaction.status,
        }),
    );
  }

  @Get(':id')
  @UseGuards(WorkspaceGuard)
  @ApiOperation({ summary: 'Get Transaction By ID' })
  @ApiResponse({ status: 200, description: 'Fetch transaction by ID' })
  @ApiResponse({
    status: 400,
    description: 'Failed to find transaction with id',
  })
  async findOne(
    @Param('id') id: string,
    @CurrentWorkspaceId() workspaceId: string,
  ): Promise<TransactionDto> {
    const transaction = await this.transactionService.findOne(id, workspaceId);

    if (!transaction) {
      this.logger.warn({ id: id }, `Failed to get transaction by ID`);
      throw new InternalServerErrorException(
        'ERROR: Failed to get transaction by id.',
      );
    }

    return new TransactionDto({
      id: transaction.id,
      projectId: transaction.projectId,
      project: transaction.project,
      amount: transaction.amount,
      paymentMethod: transaction.paymentMethod,
      paymentDate: transaction.paymentDate,
      status: transaction.status,
    });
  }

  @Patch(':id')
  @UseGuards(WorkspaceGuard)
  @ApiOperation({ summary: 'Update transaction' })
  @ApiResponse({ status: 200, description: 'Transaction updated successfully' })
  @ApiResponse({ status: 400, description: 'Failed to update transaction' })
  async update(
    @Param('id') id: string,
    @CurrentWorkspaceId() workspaceId: string,
    @Body() payload: UpdateTransactionDto,
  ): Promise<TransactionDto> {
    const transaction = await this.transactionService.update(
      id,
      workspaceId,
      payload,
    );

    if (!transaction) {
      this.logger.warn({ id: id }, `Failed to update transaction.`);
      throw new InternalServerErrorException(
        'ERROR: Failed to update transaction.',
      );
    }

    return new TransactionDto({
      id: transaction.id,
      projectId: transaction.projectId,
      amount: transaction.amount,
      paymentMethod: transaction.paymentMethod,
      paymentDate: transaction.paymentDate,
      status: transaction.status,
    });
  }

  @Delete(':id')
  @UseGuards(WorkspaceGuard)
  @ApiOperation({ summary: 'Delete transaction' })
  @ApiResponse({
    status: 200,
    description: 'Transaction deleated successfully',
  })
  @ApiResponse({ status: 400, description: 'Failed to delete transaction' })
  async remove(
    @Param('id') id: string,
    @CurrentWorkspaceId() workspaceId: string,
  ): Promise<boolean> {
    const isTransactionDeleated = await this.transactionService.remove(
      id,
      workspaceId,
    );

    if (!isTransactionDeleated) {
      this.logger.warn({ id: id }, `Failed to delete transaction.`);
      throw new InternalServerErrorException(
        'ERROR: Failed to delete transaction.',
      );
    }

    return isTransactionDeleated;
  }
}
