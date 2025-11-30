import { Job } from 'src/jobs/entities/job.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AppliedStatus } from './applied.enum';

@Entity()
export class Applied {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: AppliedStatus,
    default: AppliedStatus.APPLIED,
  })
  status: AppliedStatus;

  @OneToMany(() => User, (user) => user.appliedJobs)
  userId: User;

  @OneToMany(() => Job, (job) => job.appliers)
  jobId: Job;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
