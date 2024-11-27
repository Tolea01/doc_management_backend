import { PartialType } from '@nestjs/mapped-types';
import { CreateEntryDocumentDto } from './create-entry_document.dto';

export class UpdateEntryDocumentDto extends PartialType(
  CreateEntryDocumentDto,
) {}
