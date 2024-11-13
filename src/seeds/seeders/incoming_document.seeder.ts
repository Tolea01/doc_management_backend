import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IncomingDocument } from 'app/modules/incoming_documents/entities/incoming_document.entity';
import { Person } from 'app/modules/person/entities/person.entity';
import { Repository } from 'typeorm';

@Injectable()
export class IncomingDocumentSeeder {
  constructor(
    @InjectRepository(IncomingDocument)
    private readonly incomingDocumentRepository: Repository<IncomingDocument>,
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  async seed(): Promise<void> {
    const persons = await this.personRepository.find();
    if (persons.length === 0) {
      throw new Error('No persons found in the database. Seed persons first.');
    }

    const incomingDocumentData = Array.from({ length: 20 }, () => {
      const sender = faker.helpers.arrayElement(persons);
      const received = faker.helpers.arrayElement(persons);
      const executors = faker.helpers.arrayElements(
        persons,
        faker.number.int({ min: 1, max: 5 }),
      );

      return {
        initial_number: faker.string.alphanumeric(10),
        number: faker.string.alphanumeric(8),
        sender,
        comment: faker.lorem.sentence(),
        received,
        initial_date: faker.date.past().toISOString(),
        date: faker.date.recent().toISOString(),
        executors,
        execution_time: faker.date.future().toISOString(),
        location: faker.location.city(),
      };
    });

    for (const data of incomingDocumentData) {
      const documentExists = await this.incomingDocumentRepository.findOneBy({
        number: data.number,
      });

      if (!documentExists) {
        await this.incomingDocumentRepository.save(
          this.incomingDocumentRepository.create(data),
        );
      }
    }
  }
}
