import { Content } from '../../content/entities/content.entity';
import { Course } from '../../course/entities/course.entity';
import { EnrollmentModule } from '../../enrollment-module/entities/enrollment-module.entity';
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

@Entity('modules')
export class Module {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column()
  duration: number;

  @Column({ default: false })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.modules)
  author: User;

  @ManyToOne(() => Course, (course) => course.modules)
  course: Course;

  @OneToMany(() => Content, (content) => content.module)
  contents: Content[];

  @OneToMany(
    () => EnrollmentModule,
    (enrollmentModule) => enrollmentModule.module,
  )
  enrollmentModules: EnrollmentModule[];
}
