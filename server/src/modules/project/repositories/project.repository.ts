import { BaseRepository } from 'src/common/repositories/base.repository';
import { ProjectEntity } from '../entities/project.entity';
import { DataSource } from 'typeorm';
import { UpdateProjectDto } from '../dto/update-project.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

type ProjectResponse = {
  projects: ProjectEntity[];
  total: number;
  active: number;
};

@Injectable()
export class ProjectRepository extends BaseRepository<ProjectEntity> {
  constructor(dataSoruce: DataSource) {
    super(dataSoruce, ProjectEntity);
  }

  async getAllProjects(): Promise<ProjectResponse> {
    const stats = await this.repository
      .createQueryBuilder('projects')
      .select('COUNT(*)', 'total')
      .addSelect(`COUNT(*) FILTER(WHERE status = 'in_progress')`, 'active')
      .getRawOne();

    const projects = await this.repository.find();

    return {
      projects: projects,
      total: stats.total,
      active: stats.active,
    };
  }

  async update(id: string, payload: UpdateProjectDto): Promise<ProjectEntity> {
    const existingProject = await this.repository.findOne({
      where: { id: id },
    });

    if (!existingProject) {
      throw new NotFoundException(`project with id: ${id} not found.!`);
    }

    const project = await this.repository.save(payload);

    if (!project) {
      throw new BadRequestException(
        `error updating the project with id: ${id}`,
      );
    }

    return project;
  }

  async deleteProject(id: string): Promise<boolean> {
    const existingProject = await this.repository.findOne({
      where: { id: id },
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
