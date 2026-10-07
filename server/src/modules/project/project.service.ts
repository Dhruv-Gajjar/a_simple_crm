import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectRepository } from './repositories/project.repository';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private logger: PinoLogger,
  ) {}

  async create(workspaceId: string, payload: CreateProjectDto) {
    this.logger.info({ name: payload.name }, `project created.`);

    return await this.projectRepository.createAndSave({
      name: payload.name,
      description: payload.description,
      clientId: payload.clientId,
      status: payload.status,
      totalAmount: payload.totalAmount,
      iterations: payload.iterations,
      startDate: payload.startDate,
      endDate: payload.endDate,
      workspaceId: workspaceId,
    });
  }

  async findAll(workspaceId: string) {
    this.logger.info({ action: 'getAllProjects' }, 'Getting all projects');
    return await this.projectRepository.getAllProjects(workspaceId);
  }

  async findOne(id: string, workspaceId: string) {
    this.logger.info({ id: id }, `Get project with ID: ${id}`);
    return await this.projectRepository.findOne({
      relations: { client: true, transactions: true, notes: true },
      where: { id: id, workspaceId: workspaceId },
    });
  }

  async update(id: string, workspaceId: string, payload: UpdateProjectDto) {
    this.logger.info({ id: id }, `Update project with ID: ${id}`);
    return await this.projectRepository.update(id, workspaceId, payload);
  }

  async remove(id: string, workspaceId: string) {
    this.logger.info({ id: id }, `Delete project with ID: ${id}`);
    return await this.projectRepository.deleteProject(id, workspaceId);
  }
}
