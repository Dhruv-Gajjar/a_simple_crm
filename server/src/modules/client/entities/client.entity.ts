import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';

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

  @Column({ name: 'remakrs', type: 'varchar' })
  remarks!: string;
}
