import { BaseEntity } from 'src/common/entities/base.entity';
import { ClientEntity } from 'src/modules/client/entities/client.entity';
import { WorkspaceMemberEntity } from 'src/modules/workspace-member/entities/workspace-member.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'workspaces' })
export class WorkspaceEntity extends BaseEntity {
  @Column({ name: 'name', type: 'varchar', length: 120 })
  name!: string;

  @Column({ name: 'slug', type: 'varchar', length: 120, unique: true })
  slug!: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @OneToMany(() => WorkspaceMemberEntity, (member) => member.workspace)
  members!: WorkspaceMemberEntity[];

  @OneToMany(() => ClientEntity, (client) => client.workspace)
  clients!: ClientEntity[];
}
