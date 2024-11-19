import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { PersonType } from '../types/type.enum';

export class PersonFilterDto {
  @ApiPropertyOptional({
    example: 'filter[type]=legal',
    description: 'filter by person type',
    enum: PersonType,
    enumName: 'PersonType',
  })
  @IsOptional()
  @IsEnum(PersonType, {
    message: i18nValidationMessage('validation.INVALID_USER_ENUM'),
  })
  type: PersonType;

  @ApiPropertyOptional({
    example: 'filter[name]=john',
    description: 'filter by name',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  name: string;

  @ApiPropertyOptional({
    example: 'filter[address]=balti',
    description: 'filter by address',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  address: string;
}
