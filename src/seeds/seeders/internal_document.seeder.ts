import { faker } from '@faker-js/faker/.';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { InternalDocument } from 'app/modules/internal_documents/entities/internal_document.entity';
import { User } from 'app/modules/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InternalDocumentSeeder {
  constructor(
    @InjectRepository(InternalDocument)
    private readonly internalDocumentRepository: Repository<InternalDocument>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async seed(): Promise<void> {
    const users = await this.userRepository.find();

    if (users.length === 0) {
      throw new Error('No users found in the database. Seed users first.');
    }

    const InternalDocumentData = Array.from({ length: 20 }, () => {
      const executors = faker.helpers.arrayElements(
        users,
        faker.number.int({ min: 1, max: 5 }),
      );
      const coordinators = faker.helpers.arrayElements(
        users,
        faker.number.int({ min: 1, max: 5 }),
      );

      return {
        number: faker.string.alphanumeric(8),
        date: faker.date.recent().toISOString(),
        comment: faker.lorem.sentence(5),
        resolution: faker.lorem.sentence(5),
        coordinators,
        executors,
        execution_time: faker.date.future().toISOString(),
        file_path: `${this.configService.get<string>('INTERNAL_DOCUMENTS_UPLOAD_DEST')}/${faker.string.alphanumeric(10)}.pdf`,
      };
    });

    for (const data of InternalDocumentData) {
      const documentExists = await this.internalDocumentRepository.findOneBy({
        number: data.number,
      });

      if (!documentExists) {
        await this.internalDocumentRepository.save(
          this.internalDocumentRepository.create(data),
        );
      }
    }
  }
}
