import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { translateMessage } from 'app/utils/translateMessage';
import { PersonResponseDto } from './dto/person-response.dto';
import { SortOrder } from 'database/validators/typeorm.sort.validator';
import { PersonSort } from './validators/person.sort.validator';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { PersonItemDto } from './dto/person-item.dto';
import { PersonFilterBuilder } from './builders/person.filter.builder';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly i18n: I18nService,
  ) {}
  async create(createPersonDto: CreatePersonDto): Promise<PersonResponseDto> {
    try {
      const existPerson: Person | undefined =
        await this.personRepository.findOne({
          where: { name: createPersonDto.name },
        });

      if (existPerson) {
        throw new ConflictException(
          await translateMessage(this.i18n, 'error.person_already_exists', {
            name: existPerson.name,
          }),
        );
      }

      return this.personRepository.save(createPersonDto);
    } catch (error) {
      throw new InternalServerErrorException(
        await translateMessage(this.i18n, 'error.registration_person_failed', {
          error: error.message,
        }),
      );
    }
  }

  async findAll(
    limit?: number,
    page?: number,
    sortOrder?: SortOrder,
    sortColumn?: PersonSort,
    filter?: Record<string, any>,
  ): Promise<Pagination<PersonItemDto>> {
    try {
      const filterBuilder: PersonFilterBuilder = new PersonFilterBuilder(
        filter,
      );
      const queryBuilder: SelectQueryBuilder<Person> = this.personRepository
        .createQueryBuilder('persons')
        .where(filterBuilder.getFilter())
        .orderBy(sortColumn, sortOrder)
        .skip(page * limit)
        .take(limit);

      return await paginate<Person>(queryBuilder, { limit, page });
    } catch (error) {
      throw new InternalServerErrorException(
        await translateMessage(this.i18n, 'error.fetch_persons_failed', {
          error: error.message,
        }),
      );
    }
  }

  async findOne(id: number): Promise<Person | undefined> {
    try {
      const person: Person | undefined = await this.personRepository.findOne({
        where: { id },
      });
      return person;
    } catch (error) {
      throw new NotFoundException(
        await translateMessage(this.i18n, 'error.person_not_found', {
          id,
          error: error.message,
        }),
      );
    }
  }

  async update(
    id: number,
    updatePersonDto: UpdatePersonDto,
  ): Promise<UpdatePersonDto> {
    try {
      await this.findOne(id);

      await this.personRepository.update(id, updatePersonDto);

      return updatePersonDto;
    } catch (error) {
      throw new InternalServerErrorException(
        await translateMessage(this.i18n, 'error.update_failed', {
          id,
          error: error.message,
        }),
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.personRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(
        await translateMessage(this.i18n, 'error.delete_failed', {
          id,
          error: error.message,
        }),
      );
    }
  }
}
