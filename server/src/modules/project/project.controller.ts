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
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PinoLogger } from 'nestjs-pino';
import { ProjectDto } from './dto/project.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProjectEntity } from './entities/project.entity';
import { WorkspaceGuard } from 'src/common/guards/workspace.guard';
import { CurrentWorkspaceId } from 'src/common/decorators/current-workspace.decorator';

@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private logger: PinoLogger,
  ) {}

  @Post()
  @UseGuards(WorkspaceGuard)
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project registered successfully' })
  @ApiResponse({ status: 400, description: 'Failed to create project' })
  async create(
    @CurrentWorkspaceId() workspaceId: string,
    @Body() payload: CreateProjectDto,
  ) {
    const project = await this.projectService.create(workspaceId, payload);

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
  @UseGuards(WorkspaceGuard)
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, description: 'All projects fetch successfully' })
  async findAll(
    @CurrentWorkspaceId() workspaceId: string,
  ): Promise<ProjectDto[]> {
    const projectsRes = await this.projectService.findAll(workspaceId);

    if (!projectsRes) {
      this.logger.warn(
        { action: 'getAllProjects' },
        'Error getting all projects...',
      );
      throw new NotFoundException(
        'ERROR: Failed to get all projects, Server error.',
      );
    }

    return projectsRes.map(
      (project: ProjectEntity) =>
        new ProjectDto({
          id: project.id,
          name: project.name,
          description: project.description,
          clientId: project.clientId,
          client: project.client,
          status: project.status,
          totalAmount: project.totalAmount,
          iterations: project.iterations,
          startDate: project.startDate,
          endDate: project.endDate,
          transactions: project.transactions,
          notes: project.notes,
        }),
    );
  }

  @Get(':id')
  @UseGuards(WorkspaceGuard)
  @ApiOperation({ summary: 'Get project by id' })
  @ApiResponse({ status: 200, description: 'Project found successfully' })
  @ApiResponse({ status: 400, description: 'Failed to find project' })
  async findOne(
    @Param('id') id: string,
    @CurrentWorkspaceId() workspaceId: string,
  ) {
    const project = await this.projectService.findOne(id, workspaceId);

    if (!project) {
      this.logger.warn({ id: id }, 'Error finding project with id...');
      throw new NotFoundException('ERROR: Project not found.');
    }
    return new ProjectDto({
      id: project.id,
      name: project.name,
      description: project.description,
      clientId: project.clientId,
      client: project.client,
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
  @UseGuards(WorkspaceGuard)
  @ApiOperation({ summary: 'Update project' })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  @ApiResponse({ status: 400, description: 'Failed to update project' })
  async update(
    @Param('id') id: string,
    @CurrentWorkspaceId() workspaceId: string,
    @Body() payload: UpdateProjectDto,
  ) {
    const project = await this.projectService.update(id, workspaceId, payload);

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
      client: project.client,
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
  @UseGuards(WorkspaceGuard)
  @ApiOperation({ summary: 'Delete project' })
  @ApiResponse({ status: 200, description: 'Project deleated successfully' })
  @ApiResponse({ status: 400, description: 'Failed to delete project' })
  async remove(
    @Param('id') id: string,
    @CurrentWorkspaceId() workspaceId: string,
  ) {
    const isDeleated = await this.projectService.remove(id, workspaceId);

    if (!isDeleated) {
      this.logger.warn({ id: id }, 'Failed to delete this project');
      throw new BadRequestException(
        `ERROR: Failed to delete project, Not found.`,
      );
    }

    return 'Poject successfully deleated.!';
  }
}
