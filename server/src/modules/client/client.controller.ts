import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClientEntity } from './entities/client.entity';
import { ClientDto } from './dto/client.dto';
import { PinoLogger } from 'nestjs-pino';
import { WorkspaceGuard } from 'src/common/guards/workspace.guard';
import { CurrentWorkspaceId } from 'src/common/decorators/current-workspace.decorator';

@Controller('client')
export class ClientController {
  constructor(
    private readonly clientService: ClientService,
    private logger: PinoLogger,
  ) {}

  @Post()
  @UseGuards(WorkspaceGuard)
  @ApiOperation({ summary: 'Register a new client' })
  @ApiResponse({ status: 201, description: 'Client registered successfully' })
  @ApiResponse({ status: 400, description: 'Client already exists' })
  async create(
    @CurrentWorkspaceId() workspaceId: string,
    @Body() createClientDto: CreateClientDto,
  ) {
    const client = await this.clientService.create(
      workspaceId,
      createClientDto,
    );

    return new ClientDto({
      id: client.id,
      name: client.name,
      email: client.email,
      source: client.source,
      status: client.status,
      phoneNumber: client.phoneNumber,
      remarks: client.remarks,
    });
  }

  @Get()
  @UseGuards(WorkspaceGuard)
  @ApiOperation({ summary: 'List all clients' })
  @ApiResponse({ status: 200, description: 'Returns all clients' })
  async findAll(
    @CurrentWorkspaceId() workspaceId: string,
  ): Promise<ClientDto[]> {
    const clientsRes = await this.clientService.findAll(workspaceId);
    return clientsRes.map(
      (client: ClientEntity) =>
        new ClientDto({
          id: client.id,
          name: client.name,
          email: client.email,
          source: client.source,
          status: client.status,
          phoneNumber: client.phoneNumber,
          remarks: client.remarks,
          projects: client.projects,
        }),
    );
  }

  @Get(':id')
  @UseGuards(WorkspaceGuard)
  @UseGuards(WorkspaceGuard)
  async findOne(
    @Param('id') id: string,
    @CurrentWorkspaceId() workspaceId: string,
  ) {
    const client = await this.clientService.findOne(id, workspaceId);

    if (!client) {
      this.logger.warn({ id: id }, `Client with ID: ${id} not found...`);
      throw new NotFoundException(`Client with ID: ${id} not found.!`);
    }

    return new ClientDto({
      id: client.id,
      name: client.name,
      email: client.email,
      source: client.source,
      status: client.status,
      phoneNumber: client.phoneNumber,
      remarks: client.remarks,
      projects: client.projects,
    });
  }

  @Patch(':id')
  @UseGuards(WorkspaceGuard)
  async update(
    @Param('id') id: string,
    @CurrentWorkspaceId() workspaceId: string,
    @Body() payload: UpdateClientDto,
  ) {
    const client = await this.clientService.update(id, workspaceId, payload);

    if (!client) {
      this.logger.warn({ id: id }, `Client with ID: ${id} not found...`);
      throw new NotFoundException(`Client with ID: ${id} not found.!`);
    }

    return new ClientDto({
      id: client.id,
      name: client.name,
      email: client.email,
      source: client.source,
      status: client.status,
      phoneNumber: client.phoneNumber,
      remarks: client.remarks,
    });
  }

  @Delete(':id')
  @UseGuards(WorkspaceGuard)
  async remove(
    @Param('id') id: string,
    @CurrentWorkspaceId() workspaceId: string,
  ) {
    const isDeleated = await this.clientService.remove(id, workspaceId);
    return isDeleated;
  }
}
