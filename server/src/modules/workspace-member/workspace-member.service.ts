import { BadRequestException, Injectable } from '@nestjs/common';
import { WorkspaceMemberRepository } from './repositories/workspace-members.repository';
import { CreateWorkspaceMemberDto } from './dtos/create-workspace-member.dto';
import { WorkspaceMemberDto } from './dtos/workspace-member.dto';

@Injectable()
export class WorkspaceMemberService {
  constructor(private repository: WorkspaceMemberRepository) {}

  async create(input: CreateWorkspaceMemberDto): Promise<WorkspaceMemberDto> {
    const newWorkspaceMember = await this.repository.createAndSave(input);

    console.log({ newWorkspaceMember });
    if (!newWorkspaceMember) {
      throw new BadRequestException();
    }

    const savedNewWorkspaceMember =
      await this.repository.save(newWorkspaceMember);

    return new WorkspaceMemberDto({
      id: savedNewWorkspaceMember.id,
      workspaceId: savedNewWorkspaceMember.workspaceId,
      userId: savedNewWorkspaceMember.userId,
      role: savedNewWorkspaceMember.role,
      workspace: savedNewWorkspaceMember.workspace,
      user: savedNewWorkspaceMember.user,
    });
  }
}
