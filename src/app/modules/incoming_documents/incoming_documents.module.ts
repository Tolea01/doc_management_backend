import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonModule } from '../person/person.module';
import { UserModule } from '../user/user.module';
import { IncomingDocument } from './entities/incoming_document.entity';
import { IncomingDocumentsController } from './incoming_documents.controller';
import { IncomingDocumentsService } from './incoming_documents.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([IncomingDocument]),
    UserModule,
    PersonModule,
  ],
  controllers: [IncomingDocumentsController],
  providers: [IncomingDocumentsService],
})
export class IncomingDocumentsModule {}
