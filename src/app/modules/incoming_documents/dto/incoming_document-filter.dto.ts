import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsNumber, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class IncomingDocumentFilterDto {
  @ApiPropertyOptional({
    example: 'filter[initial_number]=mJkYfaF38t',
    description: 'filter by initial_number',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  initial_number: string;

  @ApiPropertyOptional({
    example: 'filter[number]=uvTrD1Ri',
    description: 'filter by number',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  number: string;

  @ApiPropertyOptional({
    example: 'filter[sender]=2',
    description: 'filter by sender id',
  })
  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('validation.INVALID_NUMBER') })
  sender: number;

  @ApiPropertyOptional({
    example: 'filter[received]=3',
    description: 'filter by received id',
  })
  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('validation.INVALID_NUMBER') })
  received: number;

  @ApiPropertyOptional({
    example: 'filter[initial_date]=2024-07-02',
    description: 'filter by initial_date',
  })
  @IsOptional()
  @IsISO8601(
    {},
    { message: i18nValidationMessage('validation.INVALID_DATE_STRING') },
  )
  initial_date: string;

  @ApiPropertyOptional({
    example: 'filter[date]=2024-07-02',
    description: 'filter by date',
  })
  @IsOptional()
  @IsISO8601(
    {},
    { message: i18nValidationMessage('validation.INVALID_DATE_STRING') },
  )
  date: string;

  @ApiPropertyOptional({
    example: 'filter[execution_time]=2024-07-02',
    description: 'filter by execution_time',
  })
  @IsOptional()
  @IsISO8601(
    {},
    { message: i18nValidationMessage('validation.INVALID_DATE_STRING') },
  )
  execution_time: string;

  @ApiPropertyOptional({
    example: 'filter[location]=balti',
    description: 'filter by location',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  location: string;
}
