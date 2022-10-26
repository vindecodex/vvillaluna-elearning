import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { Role } from '../../authorization/enums/role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Subject } from '../../subject/entities/subject.entity';
import { Course } from '../../course/entities/course.entity';
import { Module } from '../../module/entities/module.entity';
import { Content } from '../../content/entities/content.entity';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  @Exclude()
  salt: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @Column()
  isActive: boolean;

  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @OneToMany(() => Subject, (subject) => subject.owner)
  subjects: Subject[];

  @OneToMany(() => Course, (course) => course.author)
  courses: Course[];

  @OneToMany(() => Module, (module) => module.author)
  modules: Module[];

  @OneToMany(() => Content, (content) => content.author)
  contents: Content[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.user)
  enrollments: Enrollment[];
}
