import { BaseEntity } from 'src/common/entities/base.entity';
import { WorkspaceMemberEntity } from 'src/modules/workspace-member/entities/workspace-member.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column({ name: 'username', type: 'varchar', length: 100, unique: true })
  username!: string;

  @Column({ name: 'email', type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 255,
    select: false,
  })
  passwordHash!: string;

  @Column({ name: 'first_name', type: 'varchar', length: 100, nullable: true })
  firstName!: string;

  @Column({
    name: 'last_name',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  lastName!: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @OneToMany(() => WorkspaceMemberEntity, (member) => member.user)
  memberships!: WorkspaceMemberEntity[];
}
