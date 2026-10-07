import { BaseRepository } from 'src/common/repositories/base.repository';
import { ClientEntity } from '../entities/client.entity';
import { DataSource } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateClientDto } from '../dto/update-client.dto';

@Injectable()
export class ClientRepository extends BaseRepository<ClientEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, ClientEntity);
  }

  async getAllClients(workspaceId: string): Promise<ClientEntity[]> {
    const clients = await this.repository.find({
      relations: {
        projects: true,
      },
      where: {
        workspaceId: workspaceId,
      },
    });

    return clients;
  }

  async update(
    id: string,
    workspaceId: string,
    payload: UpdateClientDto,
  ): Promise<ClientEntity> {
    const existingClient = await this.repository.findOne({
      where: { id: id, workspaceId: workspaceId },
    });

    if (!existingClient) {
      throw new NotFoundException(`Client with ID: ${id} not found.!`);
    }

    const client = await this.repository.save(payload);

    if (!client) {
      throw new BadRequestException(`Error updating the client with ID: ${id}`);
    }

    return client;
  }

  async deleteClient(id: string, workspaceId: string): Promise<boolean> {
    const existingClient = await this.repository.findOne({
      where: { id: id, workspaceId: workspaceId },
    });

    if (!existingClient) {
      throw new NotFoundException(`Client with ID: ${id} not found.!`);
    }

    const client = await this.repository.remove(existingClient);

    if (!client) {
      throw new BadRequestException(`Error deleting the client with ID: ${id}`);
    }

    return true;
  }
}
