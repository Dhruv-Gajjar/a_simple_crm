import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateWorkspaceDto } from './dtos/create-workspace.dto';
import { WorkspaceDto } from './dtos/workspace.dto';
import { WorkspaceRepository } from './repositories/workspace.repository';
import { UpdateWorkspaceDto } from './dtos/update-workspace.dto';
import { sanitizeInput } from 'src/utils/utils';
import {
  WorkspaceMemberEntity,
  WorkspaceRole,
} from '../workspace-member/entities/workspace-member.entity';
import { DataSource, QueryFailedError } from 'typeorm';
import { WorkspaceEntity } from './entities/workspace.entity';

@Injectable()
export class WorkspaceService {
  constructor(
    private readonly dataSource: DataSource,
    private repository: WorkspaceRepository,
  ) {}

  async create(
    userId: string,
    payload: CreateWorkspaceDto,
  ): Promise<WorkspaceDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingWorkspace = await queryRunner.manager.findOne(
        WorkspaceEntity,
        {
          where: {
            slug: payload.slug,
          },
        },
      );

      if (existingWorkspace) {
        throw new ConflictException(
          `Workspace with slug: ${payload.slug} already exists try a another one.`,
        );
      }

      const workspace = queryRunner.manager.create(WorkspaceEntity, {
        name: payload.name,
        slug: payload.slug,
        isActive: true,
      });

      const savedWorkspace = await queryRunner.manager.save(workspace);

      const membership = queryRunner.manager.create(WorkspaceMemberEntity, {
        userId: userId,
        workspaceId: savedWorkspace.id,
        role: WorkspaceRole.OWNER,
      });
      await queryRunner.manager.save(membership);
      await queryRunner.commitTransaction();

      return new WorkspaceDto({
        id: savedWorkspace.id,
        name: savedWorkspace.name,
        slug: savedWorkspace.slug,
      });
    } catch (error: unknown) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      if (
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string })?.code === '23505'
      ) {
        throw new ConflictException(
          `Workspace slug "${payload.slug}" is already taken.`,
        );
      }

      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to create workspace.');
    } finally {
      await queryRunner.release();
    }
  }

  async getAll(userId: string): Promise<WorkspaceDto[]> {
    const workspaces = await this.repository.findAll({
      relations: {
        members: true,
        clients: true,
      },
      where: {
        members: {
          userId: userId,
        },
      },
    });

    if (workspaces.length <= 0) {
      return [];
    }

    return workspaces.map(
      (workspace) =>
        new WorkspaceDto({
          id: workspace.id,
          name: workspace.name,
          slug: workspace.slug,
          isActive: workspace.isActive,
          members: workspace.members,
          clients: workspace.clients,
        }),
    );
  }

  async getById(userId: string, id: string): Promise<WorkspaceDto> {
    const workspace = await this.repository.findOne({
      relations: {
        members: true,
        clients: true,
      },
      where: {
        id,
        members: {
          userId: userId,
        },
      },
    });

    if (!workspace) {
      throw new NotFoundException();
    }

    const sanatizeSlug = sanitizeInput(workspace.slug);

    return new WorkspaceDto({
      id: workspace.id,
      name: workspace.name,
      slug: sanatizeSlug,
      isActive: workspace.isActive,
      members: workspace.members,
      clients: workspace.clients,
    });
  }

  async update(
    userId: string,
    payload: UpdateWorkspaceDto,
  ): Promise<WorkspaceDto> {
    const workspace = await this.repository.findOne({
      relations: {
        members: true,
        clients: true,
      },
      where: {
        id: payload.id,
        members: {
          userId: userId,
        },
      },
    });

    if (!workspace) {
      throw new NotFoundException();
    }

    const member = workspace.members.find((m) => m.userId === userId);
    if (
      !member ||
      (member.role !== WorkspaceRole.OWNER &&
        member.role !== WorkspaceRole.ADMIN)
    ) {
      throw new ForbiddenException(
        `Only workspace owners or admins can update settings.`,
      );
    }

    Object.assign(workspace, payload);
    await this.repository.save(workspace);

    const sanitizeSlug = sanitizeInput(workspace.slug);

    return new WorkspaceDto({
      id: workspace.id,
      name: workspace.name,
      slug: sanitizeSlug,
      isActive: workspace.isActive,
      members: workspace.members,
      clients: workspace.clients,
    });
  }

  async delete(userId: string, id: string): Promise<boolean> {
    const workspace = await this.repository.findOne({
      where: {
        id: id,
        members: {
          userId: userId,
        },
      },
    });

    if (!workspace) {
      throw new NotFoundException();
    }

    const isDeleted = await this.repository.remove(workspace);

    if (!isDeleted) {
      return false;
    }

    return true;
  }

  async checkSlugAvailability(slug: string): Promise<string> {
    if (!slug) {
      throw new BadRequestException('Slug is required.');
    }

    const existingslug = await this.repository.findOne({
      where: {
        slug: slug,
      },
    });

    if (existingslug) {
      throw new ConflictException(
        `This URL is not available, try another one.`,
      );
    }

    return 'This URL is available.';
  }
}
