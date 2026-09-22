import { BaseEntity } from 'src/common/entities/base.entity';
import { ClientEntity } from 'src/modules/client/entities/client.entity';
import { TransactionEntity } from 'src/modules/transaction/entities/transaction.entity';
import { NoteEntity } from 'src/modules/note/entities/note.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

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
    cascade: ['soft-remove'],
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

  @Column({
    name: 'amount',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string | null) => (value != null ? parseFloat(value) : 0),
    },
  })
  totalAmount!: number;

  @Column({ name: 'iterations', type: 'int', default: 0 })
  iterations!: number;

  @Column({
    name: 'start_date',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  startDate!: Date;

  @Column({
    name: 'end_date',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  endDate!: Date;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.project)
  transactions!: TransactionEntity[];

  @OneToMany(() => NoteEntity, (note) => note.project)
  notes!: NoteEntity[];
}
