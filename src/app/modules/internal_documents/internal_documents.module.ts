import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileManagementModule } from '../file_management/file_management.module';
import { PersonModule } from '../person/person.module';
import { UserModule } from '../user/user.module';
import { InternalDocument } from './entities/internal_document.entity';
import { InternalDocumentsController } from './internal_documents.controller';
import { InternalDocumentsService } from './internal_documents.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([InternalDocument]),
    UserModule,
    PersonModule,
    FileManagementModule,
  ],
  controllers: [InternalDocumentsController],
  providers: [InternalDocumentsService],
})
export class InternalDocumentsModule {}
