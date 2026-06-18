import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClientEntity } from './entities/client.entity';
import { ClientDto } from './dto/client.dto';
import { PinoLogger } from 'nestjs-pino';

@Controller('client')
export class ClientController {
  constructor(
    private readonly clientService: ClientService,
    private logger: PinoLogger,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Register a new client' })
  @ApiResponse({ status: 201, description: 'Client registered successfully' })
  @ApiResponse({ status: 400, description: 'Client already exists' })
  async create(@Body() createClientDto: CreateClientDto) {
    const client = await this.clientService.create(createClientDto);

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
  @ApiOperation({ summary: 'List all clients' })
  @ApiResponse({ status: 200, description: 'Returns all clients' })
  async findAll(@Param('page') page: string, @Param('limit') limit: string) {
    const clientsRes = await this.clientService.findAll();
    return {
      clients: clientsRes.clients.map(
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
      ),
      total: clientsRes.total,
      active: clientsRes.active,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const client = await this.clientService.findOne(id);

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

  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload: UpdateClientDto) {
    const client = await this.clientService.update(id, payload);

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
  async remove(@Param('id') id: string) {
    const isDeleated = await this.clientService.remove(id);
    return isDeleated;
  }
}
