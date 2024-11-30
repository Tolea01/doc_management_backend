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
import { ExitDocumentFilterBuilder } from './builders/exit_document.filter.builder';
import { CreateExitDocumentDto } from './dto/create-exit_document.dto';
import { ExitDocumentFilterDto } from './dto/exit_document.filter.dto';
import { UpdateExitDocumentDto } from './dto/update-exit_document.dto';
import { ExitDocument } from './entities/exit_document.entity';
import { ExitDocumentSort } from './validators/exit_document.sort.validator';

@Injectable()
export class ExitDocumentsService {
  constructor(
    @InjectRepository(ExitDocument)
    private readonly exitDocumentRepository: Repository<ExitDocument>,
    private readonly userService: UserService,
    private readonly personService: PersonService,
    private readonly i18n: I18nService,
  ) {}

  async create(
    exitDocumentDto: CreateExitDocumentDto,
  ): Promise<CreateExitDocumentDto> {
    try {
      const { received, ...rest } = exitDocumentDto;

      const receivedPerson: Person | undefined =
        await this.personService.findOne(received);
      const executors = await this.userService.findByIds(
        exitDocumentDto.executors,
      );

      const existDocument: ExitDocument | undefined =
        await this.exitDocumentRepository.findOne({
          where: { number: exitDocumentDto.number },
        });

      if (!receivedPerson || !executors) {
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
            number: existDocument.number,
          }),
        );
      }

      const newDocument: ExitDocument = this.exitDocumentRepository.create({
        ...rest,
        received: receivedPerson,
        executors,
      });

      await this.exitDocumentRepository.save(newDocument);

      return exitDocumentDto;
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
    sortColumn?: ExitDocumentSort,
    filter?: ExitDocumentFilterDto,
  ): Promise<IPagination<ExitDocument>> {
    try {
      const filterBuilder: ExitDocumentFilterBuilder =
        new ExitDocumentFilterBuilder(filter);
      const queryBuilder: SelectQueryBuilder<ExitDocument> =
        this.exitDocumentRepository
          .createQueryBuilder('document')
          .leftJoinAndSelect('document.received', 'received')
          .leftJoinAndSelect('document.executors', 'executors')
          .where(filterBuilder.getFilter())
          .orderBy(`document.${sortColumn}`, sortOrder)
          .skip((page - 1) * limit)
          .take(limit);

      const [data, total]: [ExitDocument[], number] =
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

  async findByExecutor(id: number): Promise<ExitDocument[]> {
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

      const documents: ExitDocument[] = await this.exitDocumentRepository
        .createQueryBuilder('document')
        .innerJoinAndSelect(
          'document.executors',
          'executor',
          'executor.id = :id',
          { id },
        )
        .leftJoinAndSelect('document.received', 'received')
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

  async findOne(id: number): Promise<ExitDocument> {
    try {
      const document: ExitDocument | undefined =
        await this.exitDocumentRepository.findOne({
          where: { id },
          relations: ['executors', 'received'],
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
    updateExitDocumentDto: UpdateExitDocumentDto,
  ): Promise<UpdateExitDocumentDto> {
    try {
      const document: ExitDocument | undefined = await this.findOne(id);
      const { received, executors, ...rest } = updateExitDocumentDto;

      if (received) {
        document.received = await this.personService.findOne(received);
      }

      if (executors) {
        document.executors = (await this.userService.findByIds(
          executors,
        )) as User[];
      }

      Object.assign(document, rest);

      await this.exitDocumentRepository.save(document);

      return {
        ...rest,
        received: document.received ? Number(document.received.id) : undefined,
        executors: executors
          ? document.executors.map((user) => Number(user.id))
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
      await this.exitDocumentRepository.delete(id);
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
