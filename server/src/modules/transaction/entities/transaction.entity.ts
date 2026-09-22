import { BaseEntity } from 'src/common/entities/base.entity';
import { ProjectEntity } from 'src/modules/project/entities/project.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export enum TRANSACTION_STATUS {
  Pending = 'pending',
  Paid = 'paid',
  Failed = 'failed',
}

@Entity({ name: 'transactions' })
export class TransactionEntity extends BaseEntity {
  @Column({ name: 'project_id', type: 'uuid' })
  projectId!: string;

  @ManyToOne(() => ProjectEntity, (project) => project.transactions, {
    cascade: ['soft-remove'],
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project!: ProjectEntity;

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
  amount!: number;

  @Column({ name: 'payment_method', type: 'varchar' })
  paymentMethod!: string;

  @Column({
    name: 'payment_date',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  paymentDate!: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: TRANSACTION_STATUS,
    default: TRANSACTION_STATUS.Pending,
  })
  status!: TRANSACTION_STATUS;
}
