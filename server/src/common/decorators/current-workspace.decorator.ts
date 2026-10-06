import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser } from 'src/types/types';

interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
  workspaceId: string;
}

export const CurrentWorkspaceId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.workspaceId;
  },
);
