import { PartialType } from '@nestjs/mapped-types';
import { CreateExitDocumentDto } from './create-exit_document.dto';

export class UpdateExitDocumentDto extends PartialType(CreateExitDocumentDto) {}
