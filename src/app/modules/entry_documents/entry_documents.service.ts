import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import IPagination from 'app/common/interfaces/pagination.interface';
import { translateMessage } from 'app/utils/translateMessage';
import { I18nService } from 'nestjs-i18n';
import { SortOrder } from 'src/database/validators/typeorm.sort.validator';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Person } from '../person/entities/person.entity';
import { PersonService } from '../person/person.service';
import { UserItemDto } from '../user/dto/user-item.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { EntryDocumentFilterBuilder } from './builders/entry_document.filter.builder';
import { CreateEntryDocumentDto } from './dto/create-entry_document.dto';
import { EntryDocumentFilterDto } from './dto/entry_document-filter.dto';
import { UpdateEntryDocumentDto } from './dto/update-entry_document.dto';
import { EntryDocument } from './entities/entry_document.entity';
import { EntryDocumentSort } from './validators/entry_document.sort.validator';

@Injectable()
export class EntryDocumentsService {
  constructor(
    @InjectRepository(EntryDocument)
    private readonly entryDocumentRepository: Repository<EntryDocument>,
    private readonly userService: UserService,
    private readonly personService: PersonService,
    private readonly i18n: I18nService,
  ) {}

  async create(
    entryDocumentDto: CreateEntryDocumentDto,
    user: any,
  ): Promise<CreateEntryDocumentDto> {
    try {
      const { sender, received, ...rest } = entryDocumentDto;

      const senderPerson: Person | undefined =
        await this.personService.findOne(sender);
      const receivedPerson: Person | undefined =
        await this.personService.findOne(received);
      const executors = await this.userService.findByIds(
        entryDocumentDto.executors,
      );
      const coordinators = await this.userService.findByIds(
        entryDocumentDto.coordinators,
      );

      const existDocument: EntryDocument | undefined =
        await this.entryDocumentRepository.findOne({
          where: { entry_number: entryDocumentDto.entry_number },
        });

      if (!senderPerson || !receivedPerson || !executors || !coordinators) {
        throw new NotFoundException(
          await translateMessage(
            this.i18n,
            'error.sender_received_executor_not_found',
          ),
        );
      }

      if (existDocument) {
        throw new ConflictException(
          await translateMessage(this.i18n, 'error.document_already_exist', {
            entry_number: existDocument.entry_number,
          }),
        );
      }

      const newDocument: EntryDocument = this.entryDocumentRepository.create({
        ...rest,
        received: receivedPerson,
        sender: senderPerson,
        executors,
        coordinators,
        created_by: user.userId,
      });

      await this.entryDocumentRepository.save(newDocument);

      return entryDocumentDto;
    } catch (error) {
      throw new InternalServerErrorException(
        await translateMessage(this.i18n, 'error.document_creation_failed', {
          error: error.message,
        }),
      );
    }
  }

  async findAll(
    limit?: number,
    page?: number,
    sortOrder?: SortOrder,
    sortColumn?: EntryDocumentSort,
    filter?: EntryDocumentFilterDto,
  ): Promise<IPagination<EntryDocument>> {
    try {
      const filterBuilder: EntryDocumentFilterBuilder =
        new EntryDocumentFilterBuilder(filter);
      const queryBuilder: SelectQueryBuilder<EntryDocument> =
        this.entryDocumentRepository
          .createQueryBuilder('document')
          .leftJoinAndSelect('document.received', 'received')
          .leftJoinAndSelect('document.sender', 'sender')
          .leftJoinAndSelect('document.executors', 'executors')
          .leftJoinAndSelect('document.coordinators', 'coordinators')
          .where(filterBuilder.getFilter())
          .orderBy(`document.${sortColumn}`, sortOrder)
          .skip((page - 1) * limit)
          .take(limit);

      const [data, total]: [EntryDocument[], number] =
        await queryBuilder.getManyAndCount();

      return {
        data,
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        await translateMessage(this.i18n, 'error.fetch_documents_failed', {
          error: error.message,
        }),
      );
    }
  }

  async findByExecutor(id: number): Promise<EntryDocument[]> {
    try {
      const executor: UserItemDto | undefined =
        await this.userService.findOne(id);

      if (!executor) {
        throw new NotFoundException(
          await translateMessage(this.i18n, 'error.user_not_found', {
            id,
          }),
        );
      }

      const documents: EntryDocument[] = await this.entryDocumentRepository
        .createQueryBuilder('document')
        .innerJoinAndSelect(
          'document.executors',
          'executor',
          'executor.id = :id',
          { id },
        )
        .leftJoinAndSelect('document.sender', 'sender')
        .leftJoinAndSelect('document.received', 'received')
        .leftJoinAndSelect('document.coordinators', 'coordinators')
        .getMany();

      return documents;
    } catch (error) {
      throw new InternalServerErrorException(
        await translateMessage(this.i18n, 'error.fetch_documents_failed', {
          error: error.message,
        }),
      );
    }
  }

  async findByCoordinator(id: number): Promise<EntryDocument[]> {
    try {
      const coordinator: UserItemDto | undefined =
        await this.userService.findOne(id);

      if (!coordinator) {
        throw new NotFoundException(
          await translateMessage(this.i18n, 'error.user_not_found', {
            id,
          }),
        );
      }

      const documents: EntryDocument[] = await this.entryDocumentRepository
        .createQueryBuilder('document')
        .innerJoinAndSelect(
          'document.coordinators',
          'coordinator',
          'coordinator.id = :id',
          { id },
        )
        .leftJoinAndSelect('document.sender', 'sender')
        .leftJoinAndSelect('document.received', 'received')
        .leftJoinAndSelect('document.executors', 'executors')
        .getMany();

      return documents;
    } catch (error) {
      throw new InternalServerErrorException(
        await translateMessage(this.i18n, 'error.fetch_documents_failed', {
          error: error.message,
        }),
      );
    }
  }

  async findOne(id: number): Promise<EntryDocument> {
    try {
      const document: EntryDocument | undefined =
        await this.entryDocumentRepository.findOne({
          where: { id },
          relations: ['executors', 'coordinators', 'sender', 'received'],
        });

      return document;
    } catch (error) {
      throw new NotFoundException(
        await translateMessage(this.i18n, 'error.document_not_found', {
          error: error.message,
          id,
        }),
      );
    }
  }

  async update(
    id: number,
    updateEntryDocumentDto: UpdateEntryDocumentDto,
    user: any,
  ): Promise<UpdateEntryDocumentDto> {
    try {
      const document: EntryDocument | undefined = await this.findOne(id);
      const { sender, received, executors, coordinators, ...rest } =
        updateEntryDocumentDto;

      if (sender) {
        document.sender = await this.personService.findOne(sender);
      }

      if (received) {
        document.received = await this.personService.findOne(received);
      }

      if (executors) {
        document.executors = (await this.userService.findByIds(
          executors,
        )) as User[];
      }

      if (coordinators) {
        document.coordinators = (await this.userService.findByIds(
          coordinators,
        )) as User[];
      }

      Object.assign(document, rest);

      await this.entryDocumentRepository.save({
        updated_by: user.userId,
        updated_at: new Date(),
        ...document,
      });

      return {
        ...rest,
        sender: document.sender ? Number(document.sender.id) : undefined,
        received: document.received ? Number(document.received.id) : undefined,
        executors: executors
          ? document.executors.map((user) => Number(user.id))
          : undefined,
        coordinators: coordinators
          ? document.coordinators.map((user) => Number(user.id))
          : undefined,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        await translateMessage(this.i18n, 'error.server_error', {
          error: error.message,
        }),
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.entryDocumentRepository.delete(id);
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
