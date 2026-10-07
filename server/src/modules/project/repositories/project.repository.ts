import { BaseRepository } from 'src/common/repositories/base.repository';
import { ProjectEntity } from '../entities/project.entity';
import { DataSource } from 'typeorm';
import { UpdateProjectDto } from '../dto/update-project.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class ProjectRepository extends BaseRepository<ProjectEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, ProjectEntity);
  }

  async getAllProjects(workspaceId: string): Promise<ProjectEntity[]> {
    const projects = await this.repository.find({
      relations: {
        client: true,
        transactions: true,
        notes: true,
      },
      where: {
        workspaceId: workspaceId,
      },
    });

    return projects;
  }

  async update(
    id: string,
    workspaceId: string,
    payload: UpdateProjectDto,
  ): Promise<ProjectEntity> {
    const existingProject = await this.repository.findOne({
      relations: {
        client: true,
        transactions: true,
        notes: true,
      },
      where: { id: id, workspaceId: workspaceId },
    });

    if (!existingProject) {
      throw new NotFoundException(`project with id: ${id} not found.!`);
    }
    Object.assign(existingProject, payload);
    const project = await this.repository.save(existingProject);

    if (!project) {
      throw new BadRequestException(
        `error updating the project with id: ${id}`,
      );
    }

    return project;
  }

  async deleteProject(id: string, workspaceId: string): Promise<boolean> {
    const existingProject = await this.repository.findOne({
      where: { id: id, workspaceId: workspaceId },
    });

    if (!existingProject) {
      throw new NotFoundException(`Project with ID: ${id} not found.!`);
    }

    const project = await this.repository.remove(existingProject);

    if (!project) {
      throw new BadRequestException(
        `Error deleting the project with ID: ${id}`,
      );
    }

    return true;
  }
}
