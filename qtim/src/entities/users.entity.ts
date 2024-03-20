import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('idx_email', ['email', 'is_confirmed'])
@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { unique: true })
  email: string;

  @Column('varchar', { select: false })
  password: string;

  @Column('boolean', { default: false })
  is_confirmed: boolean;

  @CreateDateColumn()
  created_at: Date;
}
