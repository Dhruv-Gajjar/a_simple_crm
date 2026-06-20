import { BaseEntity } from 'src/common/entities/base.entity';
import { ProjectEntity } from 'src/modules/project/entities/project.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'transactions' })
export class TransactionEntity extends BaseEntity {
  @Column({ name: 'project_id', type: 'uuid' })
  projectId!: string;

  @ManyToOne(() => ProjectEntity, (project) => project.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project!: string;

  @Column({ name: 'amount', type: 'float' })
  amount!: number;

  @Column({ name: 'payment_method', type: 'varchar' })
  paymentMethod!: string;

  @Column({ name: 'payment_date', type: 'timestamptz', default: new Date() })
  paymentDate!: Date;
}
