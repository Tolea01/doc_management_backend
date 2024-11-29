import { PartialType } from '@nestjs/mapped-types';
import { CreateInternalDocumentDto } from './create-internal_document.dto';

export class UpdateInternalDocumentDto extends PartialType(
  CreateInternalDocumentDto,
) {}
