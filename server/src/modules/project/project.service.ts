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

  async create(payload: CreateProjectDto) {
    this.logger.info({ name: payload.name }, `project created.`);
    return await this.projectRepository.createAndSave(payload);
  }

  async findAll() {
    this.logger.info({ action: 'getAllProjects' }, 'Getting all projects');
    return await this.projectRepository.getAllProjects();
  }

  async findOne(id: string) {
    this.logger.info({ id: id }, `Get project with ID: ${id}`);
    return await this.projectRepository.findOne({
      relations: { client: true, transactions: true, notes: true },
      where: { id: id },
    });
  }

  async update(id: string, payload: UpdateProjectDto) {
    this.logger.info({ id: id }, `Update project with ID: ${id}`);
    return await this.projectRepository.update(id, payload);
  }

  async remove(id: string) {
    this.logger.info({ id: id }, `Delete project with ID: ${id}`);
    return await this.projectRepository.deleteProject(id);
  }
}
