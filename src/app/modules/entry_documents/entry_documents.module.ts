import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
  ],
  controllers: [EntryDocumentsController],
  providers: [EntryDocumentsService],
})
export class EntryDocumentsModule {}
