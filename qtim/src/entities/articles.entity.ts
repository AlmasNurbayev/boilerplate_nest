import {
  Index,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './users.entity';

@Index('idx_articles', ['title', 'author_id'])
@Entity()
export class Articles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { nullable: false })
  title: string;

  @Column('varchar', { nullable: false })
  text: string;

  @Column('int', { nullable: false })
  author_id: number;

  @ManyToOne(() => Users, { nullable: false })
  @JoinColumn([{ name: 'author_id', referencedColumnName: 'id' }])
  author: Users;

  @Column('varchar')
  image_path: string;

  @Column('boolean', { default: false })
  is_publicated: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
