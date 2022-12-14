import { Course } from '../../course/entities/course.entity';
import { EnrollmentModule } from '../../enrollment-module/entities/enrollment-module.entity';
import { User } from '../../user/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('enrollments')
@Unique(['user', 'course'])
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.enrollments)
  user: User;

  @ManyToOne(() => Course, (course) => course.enrollments)
  course: Course;

  @OneToMany(
    () => EnrollmentModule,
    (enrollmentModule) => enrollmentModule.enrollment,
  )
  enrollmentModules: EnrollmentModule[];
}
