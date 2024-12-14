import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ExitDocument } from 'app/modules/exit_documents/entities/exit_document.entity';
import { Person } from 'app/modules/person/entities/person.entity';
import { User } from 'app/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import IExitDocumentData from './interfaces/IExitDocument.data.interface';

@Injectable()
export class ExitDocumentSeeder {
  constructor(
    @InjectRepository(ExitDocument)
    private readonly exitDocumentRepository: Repository<ExitDocument>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly configService: ConfigService,
  ) {}

  async seed(): Promise<void> {
    const users = await this.userRepository.find();
    const persons = await this.personRepository.find();

    if (users.length === 0) {
      throw new Error('No users found in the database. Seed users first.');
    }

    if (persons.length === 0) {
      throw new Error('No persons found in the database. Seed person first.');
    }

    const ExitDocumentData: IExitDocumentData[] = Array.from(
      { length: 20 },
      () => {
        const executors = faker.helpers.arrayElements(
          users,
          faker.number.int({ min: 1, max: 5 }),
        );
        const received = faker.helpers.arrayElement(persons);

        return {
          number: faker.string.alphanumeric(8),
          date: faker.date.recent().toISOString(),
          comment: faker.lorem.sentence(5),
          received,
          executors,
          execution_time: faker.date.future().toISOString(),
          file_path: `${this.configService.get<string>('INTERNAL_DOCUMENTS_UPLOAD_DEST')}/${faker.string.alphanumeric(10)}.pdf`,
          created_by: faker.number.int({ min: 1, max: 5 }),
        };
      },
    );

    for (const data of ExitDocumentData) {
      const documentExists = await this.exitDocumentRepository.findOneBy({
        number: data.number,
      });

      if (!documentExists) {
        await this.exitDocumentRepository.save(
          this.exitDocumentRepository.create(data),
        );
      }
    }
  }
}
