import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { EntryDocument } from 'app/modules/entry_documents/entities/entry_document.entity';
import { Person } from 'app/modules/person/entities/person.entity';
import { User } from 'app/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import IEntryDocumentData from './interfaces/IEntryDocument.data.interface';

@Injectable()
export class EntryDocumentSeeder {
  constructor(
    @InjectRepository(EntryDocument)
    private readonly entryDocumentRepository: Repository<EntryDocument>,
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async seed(): Promise<void> {
    const persons = await this.personRepository.find();
    const users = await this.userRepository.find();

    if (persons.length === 0) {
      throw new Error('No persons found in the database. Seed persons first.');
    }

    if (users.length === 0) {
      throw new Error('No users found in the database. Seed users first.');
    }

    const entryDocumentData: IEntryDocumentData[] = Array.from(
      { length: 20 },
      () => {
        const sender = faker.helpers.arrayElement(persons);
        const received = faker.helpers.arrayElement(persons);
        const executors = faker.helpers.arrayElements(
          users,
          faker.number.int({ min: 1, max: 5 }),
        );
        const coordinators = faker.helpers.arrayElements(
          users,
          faker.number.int({ min: 1, max: 5 }),
        );

        return {
          entry_number: faker.string.alphanumeric(10),
          number: faker.string.alphanumeric(8),
          entry_date: faker.date.past().toISOString(),
          date: faker.date.recent().toISOString(),
          sender,
          received,
          comment: faker.lorem.sentence(5),
          resolution: faker.lorem.sentence(5),
          coordinators,
          executors,
          execution_time: faker.date.future().toISOString(),
          file_path: `${this.configService.get<string>('ENTRY_DOCUMENTS_UPLOAD_DEST')}/${faker.string.alphanumeric(10)}.pdf`,
        };
      },
    );

    for (const data of entryDocumentData) {
      const documentExists = await this.entryDocumentRepository.findOneBy({
        number: data.number,
      });

      if (!documentExists) {
        await this.entryDocumentRepository.save(
          this.entryDocumentRepository.create(data),
        );
      }
    }
  }
}
