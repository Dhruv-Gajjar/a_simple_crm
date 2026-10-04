import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dtos/create-workspace.dto';
import { WorkspaceDto } from './dtos/workspace.dto';
import { ApiResponse } from '@nestjs/swagger';
import { UpdateWorkspaceDto } from './dtos/update-workspace.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthenticatedUser } from 'src/types/types';

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'New workspace created sucessfully.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to create new workspace.',
  })
  async create(
    @Body() input: CreateWorkspaceDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<WorkspaceDto> {
    const newWorkspace = await this.workspaceService.create(
      user?.userId,
      input,
    );

    if (!newWorkspace) {
      throw new InternalServerErrorException();
    }

    return newWorkspace;
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Workspaces found sucessfully.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to get workspaces.',
  })
  async getAll(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<WorkspaceDto[]> {
    const workspaces = await this.workspaceService.getAll(user.userId);

    return workspaces;
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Workspace with ID found sucessfully.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to get workspace by ID.',
  })
  async getById(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<WorkspaceDto> {
    const workspace = await this.workspaceService.getById(user.userId, id);

    return workspace;
  }

  @Patch()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'workspace updated sucessfully.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to update workspace.',
  })
  async update(
    @Body() payload: UpdateWorkspaceDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<WorkspaceDto> {
    const workspace = await this.workspaceService.update(user.userId, payload);

    return workspace;
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<boolean> {
    const isDeleated = await this.workspaceService.delete(user.userId, id);

    return isDeleated;
  }

  @Post('check-slug')
  async checkSlugAvailability(@Body() slug: string): Promise<string> {
    const slugAvailability =
      await this.workspaceService.checkSlugAvailability(slug);

    return slugAvailability;
  }
}
