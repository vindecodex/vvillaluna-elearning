import { Enrollment } from '../../enrollment/entities/enrollment.entity';
import { Module } from '../../module/entities/module.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EnrollmentModule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isCompleted: boolean;

  @ManyToOne(() => Module, (module) => module.enrollmentModules)
  module: Module;

  @ManyToOne(() => Enrollment, (enrollment) => enrollment.enrollmentModules, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  enrollment: Enrollment;
}
