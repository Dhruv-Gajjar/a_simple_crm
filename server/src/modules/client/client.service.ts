import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientRepository } from './repositories/client.repository';

@Injectable()
export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  create(createClientDto: CreateClientDto) {
    return this.clientRepository.createAndSave({
      name: createClientDto.name,
      email: createClientDto.email,
      source: createClientDto.source,
      status: createClientDto.status,
      phoneNumber: createClientDto.phoneNumber,
      remarks: createClientDto.remakrs ? createClientDto.remakrs : '',
    });
  }

  findAll() {
    return `This action returns all client`;
  }

  findOne(id: number) {
    return `This action returns a #${id} client`;
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
