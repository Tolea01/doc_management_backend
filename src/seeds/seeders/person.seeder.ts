import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from 'app/modules/person/entities/person.entity';
import { PersonType } from 'app/modules/person/types/type.enum';
import { Repository } from 'typeorm';
import IPersonData from './interfaces/person.data.interface';

@Injectable()
export class PersonSeeder {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  async seed(): Promise<void> {
    const personData: IPersonData[] = Array.from({ length: 20 }, () => ({
      type: faker.helpers.arrayElement(Object.values(PersonType)),
      name: faker.person.fullName(),
      address: faker.location.streetAddress(),
      email_address: faker.internet.email(),
    }));

    for (const data of personData) {
      const personExist: Person | undefined =
        await this.personRepository.findOneBy({
          email_address: data.email_address,
        });

      if (!personExist) {
        await this.personRepository.save(this.personRepository.create(data));
      }
    }
  }
}
