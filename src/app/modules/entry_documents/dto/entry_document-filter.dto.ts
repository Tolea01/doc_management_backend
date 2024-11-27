import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class EntryDocumentFilterDto {
  @ApiPropertyOptional({
    example: 'filter[entry_number]=mJkYfaF38t',
    description: 'filter by initial_number',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  entry_number: string;

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
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  sender: string;

  @ApiPropertyOptional({
    example: 'filter[received]=3',
    description: 'filter by received id',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  received: string;

  @ApiPropertyOptional({
    example: 'filter[entry_date]=2024-07-02',
    description: 'filter by initial_date',
  })
  @IsOptional()
  @IsISO8601(
    {},
    { message: i18nValidationMessage('validation.INVALID_DATE_STRING') },
  )
  entry_date: string;

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
}
