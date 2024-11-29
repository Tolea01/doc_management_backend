import { ApiProperty } from '@nestjs/swagger';
import {
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateInternalDocumentDto {
  @ApiProperty({
    example: '01-02-09/23',
    description: 'document number',
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  number: string;

  @ApiProperty({
    example: 'comment',
    description: 'Document comment',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  comment?: string;

  @ApiProperty({
    example: '2002-01-02',
    description: 'Document date',
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsISO8601(
    {},
    { message: i18nValidationMessage('validation.INVALID_DATE_STRING') },
  )
  date: string;

  @ApiProperty({
    example: '[1, 2, 3]',
    description: 'List of coordinators IDs',
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber(
    {},
    { each: true, message: i18nValidationMessage('validation.INVALID_NUMBER') },
  )
  coordinators: number[];

  @ApiProperty({
    example: 'resolution',
    description: 'Document resolution',
  })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  resolution: string;

  @ApiProperty({
    example: '[1, 2, 3]',
    description: 'List of executor IDs',
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber(
    {},
    { each: true, message: i18nValidationMessage('validation.INVALID_NUMBER') },
  )
  executors: number[];

  @ApiProperty({
    example: '2024-08-19',
    description: 'Execution time',
  })
  @IsISO8601(
    {},
    { message: i18nValidationMessage('validation.INVALID_DATE_STRING') },
  )
  execution_time: string;

  @ApiProperty({
    example: '/random-document.pdf',
    description: 'file path (filename)',
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @Matches(/\.pdf$/, {
    message: i18nValidationMessage('validation.INVALID_PDF'),
  })
  file_path: string;
}
