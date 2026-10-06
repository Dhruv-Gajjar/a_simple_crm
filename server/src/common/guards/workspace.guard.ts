import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { WorkspaceMemberEntity } from 'src/modules/workspace-member/entities/workspace-member.entity';
import { DataSource } from 'typeorm';
import type { Request } from 'express';
import { AuthenticatedUser } from 'src/types/types';

interface AuthenticatedWorkspaceRequest extends Request {
  user?: AuthenticatedUser;
  workspaceId?: string;
  workspaceRole?: string;
}

@Injectable()
export class WorkspaceGuard implements CanActivate {
  constructor(private readonly dataSource: DataSource) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedWorkspaceRequest>();

    const userId = request.user?.userId;
    const rawWorkspaceHeader = request.headers['x-workspace-id'];
    const workspaceId =
      typeof rawWorkspaceHeader === 'string' ? rawWorkspaceHeader : undefined;

    if (!userId) {
      throw new ForbiddenException(
        'User context missing. Ensure JwtAuthGuard is executed first.',
      );
    }

    if (!workspaceId) {
      throw new BadRequestException(
        'Missing active workspace identifier (x-workspace-id header).',
      );
    }

    const membership = await this.dataSource
      .getRepository(WorkspaceMemberEntity)
      .findOne({
        where: {
          userId,
          workspaceId,
        },
      });

    if (!membership) {
      throw new ForbiddenException('You do not have access to this workspace.');
    }

    request.workspaceId = workspaceId;
    request.workspaceRole = membership.role;

    return true;
  }
}
