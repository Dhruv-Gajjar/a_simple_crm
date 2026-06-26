import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PinoLogger } from 'nestjs-pino';
import { ProjectDto } from './dto/project.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProjectEntity } from './entities/project.entity';

@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private logger: PinoLogger,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project registered successfully' })
  @ApiResponse({ status: 400, description: 'Failed to create project' })
  async create(@Body() payload: CreateProjectDto) {
    const project = await this.projectService.create(payload);

    if (!project) {
      this.logger.warn({ name: payload.name }, 'Error creating project...');
      throw new BadRequestException(
        `ERROR: Creating project with name: ${payload.name}, Server Error.`,
      );
    }

    return new ProjectDto({
      id: project.id,
      name: project.name,
      description: project.description,
      clientId: project.clientId,
      status: project.status,
      totalAmount: project.totalAmount,
      iterations: project.iterations,
      startDate: project.startDate,
      endDate: project.endDate,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, description: 'All projects fetch successfully' })
  async findAll() {
    const projectsRes = await this.projectService.findAll();

    if (!projectsRes) {
      this.logger.warn(
        { action: 'getAllProjects' },
        'Error getting all projects...',
      );
      throw new NotFoundException(
        'ERROR: Failed to get all projects, Server error.',
      );
    }

    return {
      projects: projectsRes.projects.map(
        (project: ProjectEntity) =>
          new ProjectDto({
            id: project.id,
            name: project.name,
            description: project.description,
            clientId: project.clientId,
            status: project.status,
            totalAmount: project.totalAmount,
            iterations: project.iterations,
            startDate: project.startDate,
            endDate: project.endDate,
            transactions: project.transactions,
            notes: project.notes,
          }),
      ),
      total: projectsRes.total,
      active: projectsRes.active,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by id' })
  @ApiResponse({ status: 200, description: 'Project found successfully' })
  @ApiResponse({ status: 400, description: 'Failed to find project' })
  async findOne(@Param('id') id: string) {
    const project = await this.projectService.findOne(id);

    if (!project) {
      this.logger.warn({ id: id }, 'Error finding project with id...');
      throw new NotFoundException('ERROR: Project not found.');
    }
    return new ProjectDto({
      id: project.id,
      name: project.name,
      description: project.description,
      clientId: project.clientId,
      status: project.status,
      totalAmount: project.totalAmount,
      iterations: project.iterations,
      startDate: project.startDate,
      endDate: project.endDate,
      transactions: project.transactions,
      notes: project.notes,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update project' })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  @ApiResponse({ status: 400, description: 'Failed to update project' })
  async update(@Param('id') id: string, @Body() payload: UpdateProjectDto) {
    const project = await this.projectService.update(id, payload);

    if (!project) {
      this.logger.warn({ id: id }, 'Error finding project with id...');
      throw new NotFoundException(
        'ERROR: Failed to update the project, Not found.',
      );
    }

    return new ProjectDto({
      id: project.id,
      name: project.name,
      description: project.description,
      clientId: project.clientId,
      status: project.status,
      totalAmount: project.totalAmount,
      iterations: project.iterations,
      startDate: project.startDate,
      endDate: project.endDate,
      transactions: project.transactions,
      notes: project.notes,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete project' })
  @ApiResponse({ status: 200, description: 'Project deleated successfully' })
  @ApiResponse({ status: 400, description: 'Failed to delete project' })
  async remove(@Param('id') id: string) {
    const isDeleated = await this.projectService.remove(id);

    if (!isDeleated) {
      this.logger.warn({ id: id }, 'Failed to delete this project');
      throw new BadRequestException(
        `ERROR: Failed to delete project, Not found.`,
      );
    }

    return 'Poject successfully deleated.!';
  }
}
