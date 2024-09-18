import { ApiProperty } from '@nestjs/swagger';
import {
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateIncomingDocumentDto {
  @ApiProperty({
    example: '01-02-09/23',
    description: 'Initial document number',
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  initial_number: string;

  @ApiProperty({
    example: '01-07/23',
    description: 'Document number',
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  number: string;

  @ApiProperty({
    example: 'MOLDINDCONBANK',
    description: 'Legal or physical person',
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.INVALID_NUMBER') })
  sender: number;

  @ApiProperty({
    example: 'comment',
    description: 'Document comment',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  comment?: string;

  @ApiProperty({
    example: 'MOLDINDCONBANK',
    description: 'Legal or physical person received the document',
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.INVALID_NUMBER') })
  received: number;

  @ApiProperty({
    example: '01-02-2002',
    description: 'Initial document date',
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsISO8601(
    {},
    { message: i18nValidationMessage('validation.INVALID_DATE_STRING') },
  )
  initial_date: string;

  @ApiProperty({
    example: '01-02-2002',
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
}
