import { BaseEntity } from 'src/common/entities/base.entity';
import { ProjectEntity } from 'src/modules/project/entities/project.entity';
import { WorkspaceEntity } from 'src/modules/workspace/entities/workspace.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'notes' })
export class NoteEntity extends BaseEntity {
  @Column({ name: 'project_id', type: 'uuid' })
  projectId!: string;

  @Column({ name: 'workspace_id', type: 'uuid', nullable: false })
  workspaceId!: string;

  @ManyToOne(() => WorkspaceEntity, (workspace) => workspace.notes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workspace_id' })
  workspace!: WorkspaceEntity;

  @ManyToOne(() => ProjectEntity, (project) => project.notes, {
    cascade: ['soft-remove'],
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project!: string;

  @Column({ name: 'content', type: 'text' })
  content!: string;
}
