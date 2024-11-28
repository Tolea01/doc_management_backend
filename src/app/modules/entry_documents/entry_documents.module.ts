import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileManagementModule } from '../file_management/file_management.module';
import { PersonModule } from '../person/person.module';
import { UserModule } from '../user/user.module';
import { EntryDocument } from './entities/entry_document.entity';
import { EntryDocumentsController } from './entry_documents.controller';
import { EntryDocumentsService } from './entry_documents.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EntryDocument]),
    UserModule,
    PersonModule,
    FileManagementModule,
  ],
  controllers: [EntryDocumentsController],
  providers: [EntryDocumentsService],
})
export class EntryDocumentsModule {}
