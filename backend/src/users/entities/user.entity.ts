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
import { UserType } from './user.enum';
import { Saved } from 'src/saved/entities/saved.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.USER,
  })
  type: string;

  @Column({
    nullable: true,
  })
  password: string;

  @Column()
  profilePic: string;

  @OneToMany(() => Applied, (applied) => applied.userId)
  appliedJobs: Applied[];

  @OneToOne(() => Resume, (resume) => resume.resumeLink)
  resume: Resume;

  @OneToOne(() => Company, (company) => company.createdBy)
  company: Company;

  @OneToMany(() => Saved, (saved) => saved.user)
  savedJobs: Saved[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
