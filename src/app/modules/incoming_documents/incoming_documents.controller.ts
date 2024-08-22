import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { IncomingDocumentsService } from './incoming_documents.service';
import { CreateIncomingDocumentDto } from './dto/create-incoming_document.dto';
import { UpdateIncomingDocumentDto } from './dto/update-incoming_document.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  fileUploadValidator,
  fileNameTransformer,
} from './validators/file-upload.validator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import ApiLanguageHeader from 'app/common/decorators/swagger/language-header';
import { Role } from 'app/common/decorators/auth/roles.decorator';
import { UserRole } from '../user/roles/role.enum';

@ApiTags('Incoming Documents')
@ApiLanguageHeader()
@ApiBearerAuth()
@Controller('incoming-documents')
@Role(UserRole.DIRECTOR, UserRole.SECRETARY)
export class IncomingDocumentsController {
  constructor(
    private readonly incomingDocumentsService: IncomingDocumentsService,
  ) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 10, fileNameTransformer()))
  async create(
    // @Body() createIncomingDocumentDto: CreateIncomingDocumentDto,
    @UploadedFiles()
    pdfFiles: Array<Express.Multer.File>,
  ) {
    return this.incomingDocumentsService.create(
      // createIncomingDocumentDto,
      pdfFiles,
    );
  }

  @Get()
  async findAll() {
    return this.incomingDocumentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.incomingDocumentsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateIncomingDocumentDto: UpdateIncomingDocumentDto,
  ) {
    return this.incomingDocumentsService.update(+id, updateIncomingDocumentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.incomingDocumentsService.remove(+id);
  }
}
