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
import { CreateExitDocumentDto } from './dto/create-exit_document.dto';
import { ExitDocumentFilterDto } from './dto/exit_document.filter.dto';
import { UpdateExitDocumentDto } from './dto/update-exit_document.dto';
import { ExitDocumentsService } from './exit_documents.service';
import { ExitDocumentSort } from './validators/exit_document.sort.validator';

@ApiTags('Exit Documents')
@ApiLanguageHeader()
@ApiBearerAuth()
@Controller('exit-documents')
export class ExitDocumentsController {
  private ENV_VAR_UPLOAD_DEST = 'EXIT_DOCUMENTS_UPLOAD_DEST';
  constructor(
    private readonly exitDocumentsService: ExitDocumentsService,
    private readonly fileManagementService: FileManagementService,
  ) {}

  @Post('upload')
  @Role(UserRole.DIRECTOR, UserRole.SECRETARY)
  @UseInterceptors(
    FilesInterceptor(
      'files',
      15,
      new AppConfig().getMulterOptions('EXIT_DOCUMENTS_UPLOAD_DEST'),
    ),
  )
  @HttpCode(200)
  @ApiOperation({
    summary: 'Upload exit documents',
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
    summary: 'Download exit documents',
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
    summary: 'Create a exit document',
    description: 'Requires DIRECTOR or SECRETARY role to upload a document',
  })
  @ApiResponse({
    status: 201,
    description: 'The document has been successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async create(
    @Body() createExitDocumentDto: CreateExitDocumentDto,
    @Req() request: Request,
  ): Promise<CreateExitDocumentDto> {
    return this.exitDocumentsService.create(
      createExitDocumentDto,
      request.user,
    );
  }

  @Get('list')
  @Role(UserRole.ALL)
  @ApiOperation({
    summary: 'Get a list of exit documents',
    description: 'Accessible by ALL users',
  })
  @ParamApiOperation('exit document')
  @QueryApiOperation('limit', 'number', 'items per page')
  @QueryApiOperation('page', 'number', 'page number')
  @QueryApiOperation('sortOrder', 'enum', 'sort order')
  @QueryApiOperation('sortColumn', 'enum', 'sort column')
  @QueryApiOperation('filter', ExitDocumentFilterDto, 'filters documents')
  @ApiResponse({
    status: 200,
    description: 'Return list of exit documents',
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
    sortColumn: ExitDocumentSort,
    @Query('filter') filter: ExitDocumentFilterDto,
  ) {
    return this.exitDocumentsService.findAll(
      limit,
      page,
      sortOrder,
      sortColumn,
      filter,
    );
  }

  @Get('executor/:id')
  @Role(UserRole.DIRECTOR, UserRole.SECRETARY, UserRole.HEAD_OF_DIRECTION)
  @ApiOperation({ summary: 'Get document by executor' })
  @ApiResponse({ status: 200, description: 'Executor has been found' })
  @ApiResponse({ status: 404, description: 'Executor not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @UseInterceptors(ExcludeUserPasswordInterceptor)
  async getDocumentByExecutor(@Param('id', ParseIntPipe) id: number) {
    return this.exitDocumentsService.findByExecutor(id);
  }

  @Get(':id')
  @Role(UserRole.ALL)
  @ApiOperation({ summary: 'Get document by id' })
  @ApiResponse({ status: 200, description: 'Document has been found' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @UseInterceptors(ExcludeUserPasswordInterceptor)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.exitDocumentsService.findOne(id);
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
    @Body() updateExitDocumentDto: UpdateExitDocumentDto,
    @Req() request: Request,
  ) {
    return this.exitDocumentsService.update(
      id,
      updateExitDocumentDto,
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
    return this.exitDocumentsService.remove(id);
  }
}
