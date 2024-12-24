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
  Req,
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
import { ExcludeUserPasswordInterceptor } from 'app/interceptors/exclude_user_password.interceptor';
import { Request } from 'express';
import AppConfig from 'src/config/app.config';
import paginationConfig from 'src/config/pagination.config';
import { SortOrder } from 'src/database/validators/typeorm.sort.validator';
import { FileManagementService } from '../file_management/file_management.service';
import { UserRole } from '../user/roles/role.enum';
import { CreateInternalDocumentDto } from './dto/create-internal_document.dto';
import { InternalDocumentFilterDto } from './dto/internal_document-filter.dto';
import { UpdateInternalDocumentDto } from './dto/update-internal_document.dto';
import { InternalDocumentsService } from './internal_documents.service';
import { InternalDocumentSort } from './validators/internal_document.sort.validator';

@ApiTags('Internal Documents')
@ApiLanguageHeader()
@ApiBearerAuth()
@Controller('internal-documents')
export class InternalDocumentsController {
  private ENV_VAR_UPLOAD_DEST = 'INTERNAL_DOCUMENTS_UPLOAD_DEST';
  constructor(
    private readonly internalDocumentsService: InternalDocumentsService,
    private readonly fileManagementService: FileManagementService,
  ) {}

  @Post('upload')
  @Role(UserRole.DIRECTOR, UserRole.SECRETARY)
  @UseInterceptors(
    FilesInterceptor(
      'files',
      15,
      new AppConfig().getMulterOptions('INTERNAL_DOCUMENTS_UPLOAD_DEST'),
    ),
  )
  @HttpCode(200)
  @ApiOperation({
    summary: 'Upload internal documents',
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
    return this.fileManagementService.saveFiles(pdfFiles);
  }

  @Get('download/:filename')
  @Role(UserRole.ALL)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Download internal documents',
  })
  @ApiResponse({
    status: 200,
    description: 'The documents has been successfully downloaded',
  })
  @ApiResponse({ status: 404, description: 'File not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async downloadFile(@Param('filename') filename: string) {
    return this.fileManagementService.downloadFile(
      filename,
      this.ENV_VAR_UPLOAD_DEST,
    );
  }

  @Delete('delete-file/:filename')
  @Role(UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.ADMIN)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Delete file',
    description:
      'Requires DIRECTOR or SECRETARY or ADMIN role to upload a document',
  })
  @ApiResponse({
    status: 200,
    description: 'The file has been successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'File not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async deleteFile(@Param('filename') filename: string) {
    return this.fileManagementService.deleteFile(
      filename,
      this.ENV_VAR_UPLOAD_DEST,
    );
  }

  @Post('create')
  @Role(UserRole.DIRECTOR, UserRole.SECRETARY)
  @ApiOperation({
    summary: 'Create a internal document',
    description: 'Requires DIRECTOR or SECRETARY role to upload a document',
  })
  @ApiResponse({
    status: 201,
    description: 'The document has been successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async create(
    @Body() createInternalDocumentDto: CreateInternalDocumentDto,
    @Req() request: Request,
  ): Promise<CreateInternalDocumentDto> {
    return this.internalDocumentsService.create(
      createInternalDocumentDto,
      request.user,
    );
  }

  @Get('list')
  @Role(UserRole.ALL)
  @ApiOperation({
    summary: 'Get a list of internal documents',
    description: 'Accessible by ALL users',
  })
  @ParamApiOperation('internal document')
  @QueryApiOperation('limit', 'number', 'items per page')
  @QueryApiOperation('page', 'number', 'page number')
  @QueryApiOperation('sortOrder', 'enum', 'sort order')
  @QueryApiOperation('sortColumn', 'enum', 'sort column')
  @QueryApiOperation('filter', InternalDocumentFilterDto, 'filters documents')
  @ApiResponse({
    status: 200,
    description: 'Return list of internal documents',
  })
  @ApiResponse({
    status: 500,
    description: 'Error when searching for parameters',
  })
  @UseInterceptors(ExcludeUserPasswordInterceptor)
  async findAll(
    @Query('limit', new DefaultValuePipe(paginationConfig.limit), ParseIntPipe)
    limit: number,
    @Query('page', new DefaultValuePipe(paginationConfig.page), ParseIntPipe)
    page: number,
    @Query('sortOrder', new DefaultValuePipe(paginationConfig.sortOrder))
    sortOrder: SortOrder,
    @Query('sortColumn', new DefaultValuePipe(paginationConfig.sortColumn))
    sortColumn: InternalDocumentSort,
    @Query('filter') filter: InternalDocumentFilterDto,
  ) {
    return this.internalDocumentsService.findAll(
      limit,
      page,
      sortOrder,
      sortColumn,
      filter,
    );
  }

  @Get('executor/:id')
  @Role(UserRole.DIRECTOR, UserRole.SECRETARY)
  @ApiOperation({ summary: 'Get document by executor' })
  @ApiResponse({ status: 200, description: 'Executor has been found' })
  @ApiResponse({ status: 404, description: 'Executor not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @UseInterceptors(ExcludeUserPasswordInterceptor)
  async getDocumentByExecutor(@Param('id', ParseIntPipe) id: number) {
    return this.internalDocumentsService.findByExecutor(id);
  }

  @Get('coordinator/:id')
  @Role(UserRole.DIRECTOR, UserRole.SECRETARY)
  @ApiOperation({ summary: 'Get document by coordinator' })
  @ApiResponse({ status: 200, description: 'Coordinator has been found' })
  @ApiResponse({ status: 404, description: 'Coordinator not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @UseInterceptors(ExcludeUserPasswordInterceptor)
  async getDocumentByCoordinator(@Param('id', ParseIntPipe) id: number) {
    return this.internalDocumentsService.findByCoordinator(id);
  }

  @Get(':id')
  @Role(UserRole.ALL)
  @ApiOperation({ summary: 'Get document by id' })
  @ApiResponse({ status: 200, description: 'Document has been found' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @UseInterceptors(ExcludeUserPasswordInterceptor)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.internalDocumentsService.findOne(id);
  }

  @Patch(':id')
  @Role(UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Update document by id',
  })
  @ApiOperation({ summary: 'Update document by id' })
  @ApiResponse({ status: 200, description: 'Document has been updated' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInternalDocumentDto: UpdateInternalDocumentDto,
    @Req() request: Request,
  ) {
    return this.internalDocumentsService.update(
      id,
      updateInternalDocumentDto,
      request.user,
    );
  }

  @Delete(':id')
  @Role(UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Delete document by id',
  })
  @ApiOperation({ summary: 'Delete document by id' })
  @ApiResponse({ status: 200, description: 'Document has been deleted' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.internalDocumentsService.remove(id);
  }
}
