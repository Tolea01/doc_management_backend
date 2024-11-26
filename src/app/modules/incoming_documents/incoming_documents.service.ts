import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { translateMessage } from 'app/utils/translateMessage';
import { createReadStream, existsSync } from 'fs';
import { I18nService } from 'nestjs-i18n';
import { resolve } from 'path';
import { SortOrder } from 'src/database/validators/typeorm.sort.validator';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ReadStream } from 'typeorm/platform/PlatformTools';
import { Person } from '../person/entities/person.entity';
import { PersonService } from '../person/person.service';
import { UserItemDto } from '../user/dto/user-item.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { IncomingDocumentFilterBuilder } from './builders/incoming_document.filter.builder';
import { CreateIncomingDocumentDto } from './dto/create-incoming_document.dto';
import { IncomingDocumentFilterDto } from './dto/incoming_document-filter.dto';
import { UpdateIncomingDocumentDto } from './dto/update-incoming_document.dto';
import { IncomingDocument } from './entities/incoming_document.entity';
import { IncomingDocumentSort } from './validators/incoming_document.sort.validator';
import IPagination from 'app/common/interfaces/pagination.interface'

@Injectable()
export class IncomingDocumentsService {
  constructor(
    @InjectRepository(IncomingDocument)
    private readonly incomingDocumentRepository: Repository<IncomingDocument>,
    private readonly userService: UserService,
    private readonly personService: PersonService,
    private readonly i18n: I18nService,
    private readonly configService: ConfigService,
  ) {}

  async saveFiles(pdfFiles: Array<Express.Multer.File>) {
    try {
      const filesName: string[] = pdfFiles.map((file) => file.filename);

      if (!pdfFiles || !filesName.length) {
        throw new BadRequestException(
          await translateMessage(this.i18n, 'validation.INVALID_PDF'),
        );
      }

      return {
        message: await translateMessage(this.i18n, 'message.UPLOAD_SUCCESS'),
        filenames: filesName,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        await translateMessage(this.i18n, 'error.server_error', {
          error: error.message,
        }),
      );
    }
  }

  async downloadFile(filename: string): Promise<StreamableFile> {
    try {
      const uploadPath: string = this.configService.get<string>(
        'INCOMING_DOCUMENTS_UPLOAD_DEST',
      );

      const filePath: string = resolve(process.cwd(), uploadPath, filename);

      if (!existsSync(filePath)) {
        throw new NotFoundException(
          await translateMessage(this.i18n, 'message.FILE_NOT_FOUND'),
        );
      }

      const fileStream: ReadStream = createReadStream(filePath);
      return new StreamableFile(fileStream);
    } catch (error) {
      throw new InternalServerErrorException(
        await translateMessage(this.i18n, 'error.server_error', {
          error: error.message,
        }),
      );
    }
  }

  async create(
    incomingDocumentDto: CreateIncomingDocumentDto,
  ): Promise<CreateIncomingDocumentDto> {
    try {
      const { sender, received, ...rest } = incomingDocumentDto;
      const senderPerson: Person | undefined =
        await this.personService.findOne(sender);
      const receivedPerson: Person | undefined =
        await this.personService.findOne(received);
      const executors = await this.userService.findByIds(
        incomingDocumentDto.executors,
      );
      const existDocument: IncomingDocument | undefined =
        await this.incomingDocumentRepository.findOne({
          where: { initial_number: incomingDocumentDto.initial_number },
        });

      if (!senderPerson || !receivedPerson || !executors) {
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
            initial_number: existDocument.initial_number,
          }),
        );
      }

      const newDocument: IncomingDocument =
        this.incomingDocumentRepository.create({
          ...rest,
          received: receivedPerson,
          sender: senderPerson,
          executors,
        });

      await this.incomingDocumentRepository.save(newDocument);

      return incomingDocumentDto;
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
    sortColumn?: IncomingDocumentSort,
    filter?: IncomingDocumentFilterDto,
  ): Promise<IPagination<IncomingDocument>> {
    try {
      const filterBuilder: IncomingDocumentFilterBuilder =
        new IncomingDocumentFilterBuilder(filter);
      const queryBuilder: SelectQueryBuilder<IncomingDocument> =
        this.incomingDocumentRepository
          .createQueryBuilder('document')
          .leftJoinAndSelect('document.received', 'received')
          .leftJoinAndSelect('document.executors', 'executors')
          .leftJoinAndSelect('document.sender', 'sender')
          .where(filterBuilder.getFilter())
          .orderBy(`document.${sortColumn}`, sortOrder)
          .skip((page - 1) * limit)
          .take(limit);

      const [data, total]: [IncomingDocument[], number] =
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

  async findByExecutor(id: number): Promise<IncomingDocument[]> {
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

      const documents: IncomingDocument[] =
        await this.incomingDocumentRepository
          .createQueryBuilder('incoming_document')
          .innerJoinAndSelect(
            'incoming_document.executors',
            'executor',
            'executor.id = :id',
            { id },
          )
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

  async findOne(id: number): Promise<IncomingDocument> {
    try {
      const document: IncomingDocument | undefined =
        await this.incomingDocumentRepository.findOne({
          where: { id },
          relations: ['executors'],
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
    updateIncomingDocumentDto: UpdateIncomingDocumentDto,
  ): Promise<UpdateIncomingDocumentDto> {
    try {
      const document: IncomingDocument | undefined = await this.findOne(id);
      const { sender, received, executors, ...rest } =
        updateIncomingDocumentDto;

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

      Object.assign(document, rest);

      await this.incomingDocumentRepository.save(document);

      return {
        ...rest,
        sender: document.sender ? Number(document.sender.id) : undefined,
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

  remove(id: number) {
    return `This action removes a #${id} incomingDocument`;
  }
}
