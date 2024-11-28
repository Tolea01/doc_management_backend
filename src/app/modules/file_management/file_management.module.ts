import { Module } from '@nestjs/common';
import { FileManagementService } from './file_management.service';

@Module({
  providers: [FileManagementService],
  exports: [FileManagementService],
})
export class FileManagementModule {}
