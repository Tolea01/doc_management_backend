import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from 'app/common/decorators/auth/roles.decorator';
import ApiLanguageHeader from 'app/common/decorators/swagger/language-header';
import ParamApiOperation from 'app/common/decorators/swagger/param.api.operation';
import QueryApiOperation from 'app/common/decorators/swagger/query.api.operation';
import AppConfig from 'src/config/app.config';
import paginationConfig from 'src/config/pagination.config';
import { SortOrder } from 'src/database/validators/typeorm.sort.validator';
import { UserRole } from '../user/roles/role.enum';
import { CreateIncomingDocumentDto } from './dto/create-incoming_document.dto';
import { IncomingDocumentFilterDto } from './dto/incoming_document-filter.dto';
import { UpdateIncomingDocumentDto } from './dto/update-incoming_document.dto';
import { IncomingDocumentsService } from './incoming_documents.service';
import { IncomingDocumentSort } from './validators/incoming_document.sort.validator';

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

  @Get('download/:filename')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Download incoming documents',
  })
  @ApiResponse({
    status: 200,
    description: 'The documents has been successfully downloaded',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async downloadFile(@Param('filename') filename: string) {
    return this.incomingDocumentsService.downloadFile(filename);
  }

  @Get('list')
  @ApiOperation({
    summary: 'Get a list of incoming documents',
    // description: 'Accessible by ALL users',
  })
  @ParamApiOperation('incoming document')
  @QueryApiOperation('limit', 'number', 'items per page')
  @QueryApiOperation('page', 'number', 'page number')
  @QueryApiOperation('sortOrder', 'enum', 'sort order')
  @QueryApiOperation('sortColumn', 'enum', 'sort column')
  @QueryApiOperation('filter', IncomingDocumentFilterDto, 'filters documents')
  @ApiResponse({
    status: 200,
    description: 'Return list of incoming documents',
  })
  @ApiResponse({
    status: 500,
    description: 'Error when searching for parameters',
  })
  async findAll(
    @Query('limit', new DefaultValuePipe(paginationConfig.limit), ParseIntPipe)
    limit: number,
    @Query('page', new DefaultValuePipe(paginationConfig.page), ParseIntPipe)
    page: number,
    @Query('sortOrder', new DefaultValuePipe(paginationConfig.sortOrder))
    sortOrder: SortOrder,
    @Query('sortColumn', new DefaultValuePipe(paginationConfig.sortColumn))
    sortColumn: IncomingDocumentSort,
    @Query('filter') filter: IncomingDocumentFilterDto,
  ) {
    return this.incomingDocumentsService.findAll(
      limit,
      page,
      sortOrder,
      sortColumn,
      filter,
    );
  }

  @Get('executor/:id')
  @ApiOperation({ summary: 'Get document by executor' })
  @ApiResponse({ status: 200, description: 'User has been found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async getDocumentByExecutor(@Param('id', ParseIntPipe) id: number) {
    return this.incomingDocumentsService.findByExecutor(id);
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
