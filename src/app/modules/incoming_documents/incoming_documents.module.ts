import { Module } from '@nestjs/common';
import { IncomingDocumentsService } from './incoming_documents.service';
import { IncomingDocumentsController } from './incoming_documents.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncomingDocument } from './entities/incoming_document.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([IncomingDocument]),
    MulterModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get<string>('INCOMING_DOCUMENTS_UPLOAD_DEST'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [IncomingDocumentsController],
  providers: [IncomingDocumentsService],
})
export class IncomingDocumentsModule {}
