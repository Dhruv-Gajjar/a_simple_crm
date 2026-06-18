import { BaseRepository } from 'src/common/repositories/base.repository';
import { ClientEntity } from '../entities/client.entity';
import { DataSource } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateClientDto } from '../dto/update-client.dto';

type ClientResponse = {
  clients: ClientEntity[];
  total: number;
  active: number;
};

@Injectable()
export class ClientRepository extends BaseRepository<ClientEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, ClientEntity);
  }

  async getAllClients(): Promise<ClientResponse> {
    const stats = await this.repository
      .createQueryBuilder('client')
      .select('COUNT(*)', 'total')
      .addSelect(`COUNT(*) FILTER(WHERE client.status = 'active')`, 'active')
      .getRawOne();

    const clients = await this.repository.find({
      relations: {
        projects: true,
      },
    });

    return {
      clients: clients,
      total: Number(stats?.total || 0),
      active: Number(stats?.active || 0),
    };
  }

  async update(id: string, payload: UpdateClientDto): Promise<ClientEntity> {
    const existingClient = await this.repository.findOne({
      where: { id: id },
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

  async deleteClient(id: string): Promise<boolean> {
    const existingClient = await this.repository.findOne({
      where: { id: id },
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
