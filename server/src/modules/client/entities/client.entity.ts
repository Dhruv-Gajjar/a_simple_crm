import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { ProjectEntity } from 'src/modules/project/entities/project.entity';
import { WorkspaceEntity } from 'src/modules/workspace/entities/workspace.entity';

export enum CLIENT_STATUS {
  Active = 'active',
  InActive = 'in_active',
  Lead = 'lead',
  Rejected = 'rejected',
}

@Entity({ name: 'clients' })
export class ClientEntity extends BaseEntity {
  @Column({ name: 'name', type: 'varchar', length: 120 })
  name!: string;

  @Column({ name: 'email', type: 'varchar', length: 120 })
  email!: string;

  @Column({ name: 'source', type: 'varchar', default: '' })
  source!: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: CLIENT_STATUS,
    default: CLIENT_STATUS.Lead,
  })
  status!: CLIENT_STATUS;

  @Column({ name: 'phone_number', type: 'varchar' })
  phoneNumber!: string;

  @Column({ name: 'remarks', type: 'varchar', nullable: true })
  remarks!: string;

  @Column({ name: 'workspace_id', type: 'uuid', nullable: false })
  workspace_id!: string;

  @ManyToOne(() => WorkspaceEntity, (workspace) => workspace.clients, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workspace_id' })
  workspace!: WorkspaceEntity;

  @OneToMany(() => ProjectEntity, (project) => project.client)
  projects!: ProjectEntity[];

  @Column({ name: 'last_contacted_at', type: 'timestamp', nullable: true })
  lastContactedAt!: Date;
}
