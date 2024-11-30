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
import { UserItemDto } from '../user/dto/user-item.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { InternalDocumentFilterBuilder } from './builders/internal_document.filter.builder';
import { CreateInternalDocumentDto } from './dto/create-internal_document.dto';
import { InternalDocumentFilterDto } from './dto/internal_document-filter.dto';
import { UpdateInternalDocumentDto } from './dto/update-internal_document.dto';
import { InternalDocument } from './entities/internal_document.entity';
import { InternalDocumentSort } from './validators/internal_document.sort.validator';

@Injectable()
export class InternalDocumentsService {
  constructor(
    @InjectRepository(InternalDocument)
    private readonly internalDocumentRepository: Repository<InternalDocument>,
    private readonly userService: UserService,
    private readonly i18n: I18nService,
  ) {}

  async create(
    internalDocumentDto: CreateInternalDocumentDto,
  ): Promise<CreateInternalDocumentDto> {
    try {
      const executors = await this.userService.findByIds(
        internalDocumentDto.executors,
      );
      const coordinators = await this.userService.findByIds(
        internalDocumentDto.coordinators,
      );

      const existDocument: InternalDocument | undefined =
        await this.internalDocumentRepository.findOne({
          where: { number: internalDocumentDto.number },
        });

      if (!executors || !coordinators) {
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

      const newDocument: InternalDocument =
        this.internalDocumentRepository.create({
          ...internalDocumentDto,
          executors,
          coordinators,
        });

      await this.internalDocumentRepository.save(newDocument);

      return internalDocumentDto;
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
    sortColumn?: InternalDocumentSort,
    filter?: InternalDocumentFilterDto,
  ): Promise<IPagination<InternalDocument>> {
    try {
      const filterBuilder: InternalDocumentFilterBuilder =
        new InternalDocumentFilterBuilder(filter);
      const queryBuilder: SelectQueryBuilder<InternalDocument> =
        this.internalDocumentRepository
          .createQueryBuilder('document')
          .leftJoinAndSelect('document.executors', 'executors')
          .leftJoinAndSelect('document.coordinators', 'coordinators')
          .where(filterBuilder.getFilter())
          .orderBy(`document.${sortColumn}`, sortOrder)
          .skip((page - 1) * limit)
          .take(limit);

      const [data, total]: [InternalDocument[], number] =
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

  async findByExecutor(id: number): Promise<InternalDocument[]> {
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

      const documents: InternalDocument[] =
        await this.internalDocumentRepository
          .createQueryBuilder('document')
          .innerJoinAndSelect(
            'document.executors',
            'executor',
            'executor.id = :id',
            { id },
          )
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

  async findByCoordinator(id: number): Promise<InternalDocument[]> {
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

      const documents: InternalDocument[] =
        await this.internalDocumentRepository
          .createQueryBuilder('document')
          .innerJoinAndSelect(
            'document.coordinators',
            'coordinator',
            'coordinator.id = :id',
            { id },
          )
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

  async findOne(id: number): Promise<InternalDocument> {
    try {
      const document: InternalDocument | undefined =
        await this.internalDocumentRepository.findOne({
          where: { id },
          relations: ['executors', 'coordinators'],
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
    updateInternalDocumentDto: UpdateInternalDocumentDto,
  ): Promise<UpdateInternalDocumentDto> {
    try {
      const document: InternalDocument | undefined = await this.findOne(id);
      const { executors, coordinators, ...rest } = updateInternalDocumentDto;

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

      await this.internalDocumentRepository.save(document);

      return {
        ...rest,
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
      await this.internalDocumentRepository.delete(id);
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
