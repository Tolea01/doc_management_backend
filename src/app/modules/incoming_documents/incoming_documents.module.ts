import { Module } from '@nestjs/common';
import { IncomingDocumentsService } from './incoming_documents.service';
import { IncomingDocumentsController } from './incoming_documents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncomingDocument } from './entities/incoming_document.entity';
import { User } from '../user/entities/user.entity';
import { Person } from '../person/entities/person.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IncomingDocument, User, Person])],
  controllers: [IncomingDocumentsController],
  providers: [IncomingDocumentsService],
})
export class IncomingDocumentsModule {}
