import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateIncomingDocumentDto } from './dto/create-incoming_document.dto';
import { UpdateIncomingDocumentDto } from './dto/update-incoming_document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IncomingDocument } from './entities/incoming_document.entity';
import { In, Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { translateMessage } from 'app/utils/translateMessage';
import { User } from '../user/entities/user.entity';
import { Person } from '../person/entities/person.entity';

@Injectable()
export class IncomingDocumentsService {
  constructor(
    @InjectRepository(IncomingDocument)
    private readonly incomingDocumentRepository: Repository<IncomingDocument>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    private readonly i18n: I18nService,
  ) {}

  async saveFiles(pdfFiles: Array<Express.Multer.File>) {
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
  }

  async create(
    incomingDocumentDto: CreateIncomingDocumentDto,
  ): Promise<CreateIncomingDocumentDto> {
    try {
      const { sender, received, ...rest } = incomingDocumentDto;
      const senderPerson: Person | undefined =
        await this.personRepository.findOne({
          where: { id: sender },
        });
      const receivedPerson: Person | undefined =
        await this.personRepository.findOne({
          where: { id: received },
        });
      const executors: User[] = await this.userRepository.findBy({
        id: In(incomingDocumentDto.executors),
      });
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
          error,
        }),
      );
    }
  }

  findAll() {
    return `This action returns all incomingDocuments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} incomingDocument`;
  }

  update(id: number, updateIncomingDocumentDto: UpdateIncomingDocumentDto) {
    return `This action updates a #${id} incomingDocument`;
  }

  remove(id: number) {
    return `This action removes a #${id} incomingDocument`;
  }
}
