import { Applied } from 'src/applied/entities/applied.entity';
import { Company } from 'src/companies/entities/company.entity';
import { Result } from 'src/results/entities/result.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { JobStatus } from './job.enum';
import { Industry } from 'src/industry/entities/industry.entity';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  desc: string;

  // TODO: fix this
  // @Column('text', { array: true })
  // tags: string[];

  @ManyToMany(() => Industry, (industry) => industry.jobs)
  industries: Industry[];

  @Column()
  resp: string;

  @Column()
  req: string;

  @Column()
  applyBy: Date;

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.OPEN,
  })
  status: JobStatus;

  @Column()
  applicants: number;

  @OneToMany(() => Applied, (applied) => applied.jobId)
  appliers: Applied[];

  @OneToMany(() => Company, (company) => company.jobs)
  createdBy: Company;

  @OneToOne(() => Result, (result) => result.job)
  result: Result;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
