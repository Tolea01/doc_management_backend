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
import { CreateEntryDocumentDto } from './dto/create-entry_document.dto';
import { EntryDocumentFilterDto } from './dto/entry_document-filter.dto';
import { UpdateEntryDocumentDto } from './dto/update-entry_document.dto';
import { EntryDocumentsService } from './entry_documents.service';
import { EntryDocumentSort } from './validators/entry_document.sort.validator';

@ApiTags('Entry Documents')
@ApiLanguageHeader()
@ApiBearerAuth()
@Controller('entry-documents')
@Role(UserRole.DIRECTOR, UserRole.SECRETARY)
export class EntryDocumentsController {
  constructor(private readonly entryDocumentsService: EntryDocumentsService) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor(
      'files',
      15,
      new AppConfig().getMulterOptions('ENTRY_DOCUMENTS_UPLOAD_DEST'),
    ),
  )
  @HttpCode(200)
  @ApiOperation({
    summary: 'Upload entry documents',
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
    return this.entryDocumentsService.saveFiles(pdfFiles);
  }

  @Post('create')
  @ApiOperation({
    summary: 'Create a entry document',
    description: 'Requires DIRECTOR or SECRETARY role to upload a document',
  })
  @ApiResponse({
    status: 201,
    description: 'The document has been successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async create(
    @Body() createEntryDocumentDto: CreateEntryDocumentDto,
  ): Promise<CreateEntryDocumentDto> {
    return this.entryDocumentsService.create(createEntryDocumentDto);
  }

  @Get('download/:filename')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Download entry documents',
  })
  @ApiResponse({
    status: 200,
    description: 'The documents has been successfully downloaded',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async downloadFile(@Param('filename') filename: string) {
    return this.entryDocumentsService.downloadFile(filename);
  }

  @Get('list')
  @ApiOperation({
    summary: 'Get a list of entry documents',
    // description: 'Accessible by ALL users',
  })
  @ParamApiOperation('entry document')
  @QueryApiOperation('limit', 'number', 'items per page')
  @QueryApiOperation('page', 'number', 'page number')
  @QueryApiOperation('sortOrder', 'enum', 'sort order')
  @QueryApiOperation('sortColumn', 'enum', 'sort column')
  @QueryApiOperation('filter', EntryDocumentFilterDto, 'filters documents')
  @ApiResponse({
    status: 200,
    description: 'Return list of entry documents',
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
    sortColumn: EntryDocumentSort,
    @Query('filter') filter: EntryDocumentFilterDto,
  ) {
    return this.entryDocumentsService.findAll(
      limit,
      page,
      sortOrder,
      sortColumn,
      filter,
    );
  }

  @Get('executor/:id')
  @ApiOperation({ summary: 'Get document by executor' })
  @ApiResponse({ status: 200, description: 'Executor has been found' })
  @ApiResponse({ status: 404, description: 'Executor not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async getDocumentByExecutor(@Param('id', ParseIntPipe) id: number) {
    return this.entryDocumentsService.findByExecutor(id);
  }

  @Get('coordinator/:id')
  @ApiOperation({ summary: 'Get document by coordinator' })
  @ApiResponse({ status: 200, description: 'Coordinator has been found' })
  @ApiResponse({ status: 404, description: 'Coordinator not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async getDocumentByCoordinator(@Param('id', ParseIntPipe) id: number) {
    return this.entryDocumentsService.findByCoordinator(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document by id' })
  @ApiResponse({ status: 200, description: 'Document has been found' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.entryDocumentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update document by id',
    // description: 'Requires ADMIN role to update a user by ID',
  })
  @ApiOperation({ summary: 'Update document by id' })
  @ApiResponse({ status: 200, description: 'Document has been updated' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEntryDocumentDto: UpdateEntryDocumentDto,
  ) {
    return this.entryDocumentsService.update(id, updateEntryDocumentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.entryDocumentsService.remove(+id);
  }
}
