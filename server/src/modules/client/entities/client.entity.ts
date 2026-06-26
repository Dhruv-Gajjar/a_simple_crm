import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { ProjectEntity } from 'src/modules/project/entities/project.entity';

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

  @Column({ name: 'soruce', type: 'varchar' })
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

  @OneToMany(() => ProjectEntity, (project) => project.client)
  projects!: ProjectEntity[];
}
