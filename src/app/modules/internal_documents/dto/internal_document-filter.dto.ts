import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class InternalDocumentFilterDto {
  @ApiPropertyOptional({
    example: 'filter[number]=mJkYfaF38t',
    description: 'filter by initial_number',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  number: string;

  @ApiPropertyOptional({
    example: 'filter[date]=2024-07-02',
    description: 'filter by initial_date',
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
