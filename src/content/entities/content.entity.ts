import { Module } from '../../module/entities/module.entity';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('contents')
export class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  content: string;

  @Column()
  type: string;

  @Column({ default: false })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.contents)
  author: User;

  @ManyToOne(() => Module, (module) => module.contents)
  module: Module;
}
