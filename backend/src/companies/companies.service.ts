import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  create(createCompanyDto: CreateCompanyDto) {
    const company = this.companyRepository.create({
      ...createCompanyDto,
      createdBy: { id: createCompanyDto.createdBy },
    });
    if (company.createdBy && company.createdBy.id) {
      company.createdBy = { id: company.createdBy.id } as User;
    }
    const savedCompany = this.companyRepository.insert(company);
    return savedCompany;
  }

  findAll() {
    return this.companyRepository.find();
  }

  findOne(id: number) {
    return this.companyRepository.findOneBy({ id });
  }

  findWhere(createdBy: number) {
    return this.companyRepository.findOneBy({ createdBy: { id: createdBy } });
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return this.companyRepository.delete(id);
  }
}
