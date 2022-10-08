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

  @Column()
  role: Role;

  @Column()
  @Exclude()
  isActive: boolean;

  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @OneToMany(() => Subject, (subject) => subject.owner)
  subjects: Subject[];
}
