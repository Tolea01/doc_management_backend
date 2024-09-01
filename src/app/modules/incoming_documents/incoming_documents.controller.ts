import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  HttpCode,
} from '@nestjs/common';
import { IncomingDocumentsService } from './incoming_documents.service';
import { CreateIncomingDocumentDto } from './dto/create-incoming_document.dto';
import { UpdateIncomingDocumentDto } from './dto/update-incoming_document.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import ApiLanguageHeader from 'app/common/decorators/swagger/language-header';
import { Role } from 'app/common/decorators/auth/roles.decorator';
import { UserRole } from '../user/roles/role.enum';
import AppConfig from 'src/config/app.config';

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
  @UseInterceptors(
    FilesInterceptor(
      'files',
      15,
      new AppConfig().getMulterOptions('INCOMING_DOCUMENTS_UPLOAD_DEST'),
    ),
  )
  @HttpCode(200)
  @ApiOperation({
    summary: 'Upload incoming documents',
    description: 'Requires DIRECTOR or SECRETARY role to upload a document',
  })
  @ApiResponse({
    status: 200,
    description: 'The documents has been successfully uploaded',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async upload(
    @UploadedFiles()
    pdfFiles: Array<Express.Multer.File>,
  ) {
    return this.incomingDocumentsService.saveFiles(pdfFiles);
  }

  @Post('create')
  @ApiOperation({
    summary: 'Create a incoming document',
    description: 'Requires DIRECTOR or SECRETARY role to upload a document',
  })
  @ApiResponse({
    status: 201,
    description: 'The document has been successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async create(
    @Body() createIncomingDocumentDto: CreateIncomingDocumentDto,
  ): Promise<CreateIncomingDocumentDto> {
    return this.incomingDocumentsService.create(createIncomingDocumentDto);
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
