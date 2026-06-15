import { BaseEntity } from 'src/common/entities/base.entity';
import { ClientEntity } from 'src/modules/client/entities/client.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export enum PROJECT_STATUS {
  Todo = 'todo',
  Completed = 'completed',
  OnHold = 'on_hold',
  InProgress = 'in_progress',
  Canceled = 'canceled',
}

@Entity({ name: 'projects' })
export class ProjectEntity extends BaseEntity {
  @Column({ name: 'name', type: 'varchar', length: 120 })
  name!: string;

  @Column({ name: 'description', type: 'varchar', length: 240 })
  description!: string;

  @Column({ name: 'client_id', type: 'uuid' })
  clientId!: string;

  @ManyToOne(() => ClientEntity, (client) => client.projects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'client_id' })
  client!: ClientEntity;

  @Column({
    name: 'status',
    type: 'enum',
    enum: PROJECT_STATUS,
    default: PROJECT_STATUS.Todo,
  })
  status!: PROJECT_STATUS;

  @Column({ name: 'total_amount', type: 'float' })
  totalAmount!: number;

  @Column({ name: 'iterations', type: 'int', default: 0 })
  iterations!: number;

  @Column({ name: 'start_date', type: 'timestamptz', default: new Date() })
  startDate!: Date;

  @Column({ name: 'end_date', type: 'timestamptz', default: new Date() })
  endDate!: Date;
}
