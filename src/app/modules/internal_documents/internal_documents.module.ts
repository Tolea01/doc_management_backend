import { Module } from '@nestjs/common';
import { InternalDocumentsService } from './internal_documents.service';
import { InternalDocumentsController } from './internal_documents.controller';

@Module({
  controllers: [InternalDocumentsController],
  providers: [InternalDocumentsService],
})
export class InternalDocumentsModule {}
