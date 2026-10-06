import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientRepository } from './repositories/client.repository';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class ClientService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private logger: PinoLogger,
  ) {}

  async create(payload: CreateClientDto) {
    const existingClient = await this.clientRepository.findOne({
      where: { email: payload.email },
    });

    if (existingClient) {
      throw new NotFoundException(
        `Client with ${payload.email} already exists`,
      );
    }

    const newClient = await this.clientRepository.createAndSave({
      name: payload.name,
      email: payload.email,
      source: payload.source,
      status: payload.status,
      phoneNumber: payload.phoneNumber,
      remarks: payload.remarks ? payload.remarks : '',
      workspaceId: payload.workspaceId,
    });

    this.logger.info({ name: payload.name }, 'Client created...!');

    return newClient;
  }

  async findAll() {
    this.logger.info({ action: 'getClients' }, 'Getting all clients');
    const clients = await this.clientRepository.getAllClients();
    return clients;
  }

  async findOne(id: string) {
    const client = await this.clientRepository.findOne({
      relations: {
        projects: true,
      },
      where: { id: id },
    });

    this.logger.info({ id: id }, 'Getting client with id');
    return client;
  }

  async update(id: string, payload: UpdateClientDto) {
    this.logger.info({ name: payload.name }, 'Client updated...!');
    return await this.clientRepository.update(id, payload);
  }

  async remove(id: string) {
    this.logger.info({ id: id }, 'Client deleted...!');
    return await this.clientRepository.deleteClient(id);
  }
}
