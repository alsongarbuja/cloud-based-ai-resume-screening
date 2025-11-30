import { Applied } from 'src/applied/entities/applied.entity';
import { Company } from 'src/companies/entities/company.entity';
import { Resume } from 'src/resumes/entities/resume.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  type: string;

  @Column()
  profilePic: string;

  @OneToMany(() => Applied, (applied) => applied.userId)
  appliedJobs: Applied[];

  @OneToMany(() => Resume, (resume) => resume.resumeLink)
  resumes: Resume[];

  @OneToOne(() => Company, (company) => company.createdBy)
  company: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
