import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import { Module } from 'src/module/entities/module.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EnrollmentModule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isCompleted: boolean;

  @ManyToOne(() => Module, (module) => module.enrollmentModules, {
    cascade: true,
  })
  module: Module;

  @ManyToOne(() => Enrollment, (enrollment) => enrollment.enrollmentModules, {
    cascade: true,
  })
  enrollment: Enrollment;
}