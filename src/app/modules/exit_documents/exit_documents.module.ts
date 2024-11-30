import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileManagementModule } from '../file_management/file_management.module';
import { PersonModule } from '../person/person.module';
import { UserModule } from '../user/user.module';
import { ExitDocument } from './entities/exit_document.entity';
import { ExitDocumentsController } from './exit_documents.controller';
import { ExitDocumentsService } from './exit_documents.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExitDocument]),
    UserModule,
    PersonModule,
    FileManagementModule,
  ],
  controllers: [ExitDocumentsController],
  providers: [ExitDocumentsService],
})
export class ExitDocumentsModule {}
