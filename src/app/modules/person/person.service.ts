import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly i18n: I18nService,
  ) {}
  async create(createPersonDto: CreatePersonDto) {
    try {
      const existPerson: Person | undefined = this.personRepository.findOne({
        where: { name: createPersonDto.name },
      });
    } catch (error) {}
  }

  async findAll() {
    return `This action returns all person`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} person`;
  }

  async update(id: number, updatePersonDto: UpdatePersonDto) {
    return `This action updates a #${id} person`;
  }

  async remove(id: number) {
    return `This action removes a #${id} person`;
  }
}
