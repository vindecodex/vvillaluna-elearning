import { Enrollment } from '../../enrollment/entities/enrollment.entity';
import { Module } from '../../module/entities/module.entity';
import { Subject } from '../../subject/entities/subject.entity';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ default: false })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Subject, (subject) => subject.courses)
  subject: Subject;

  @ManyToOne(() => User, (user) => user.courses)
  author: User;

  @OneToMany(() => Module, (module) => module.course)
  modules: Module[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];
}
