import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('idx_email', ['email', 'phone'])
@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { nullable: true })
  email: string;

  @Column('varchar', { nullable: true })
  phone: string;

  @Column('varchar', { select: false })
  password: string;

  @CreateDateColumn()
  created_at: Date;
}
