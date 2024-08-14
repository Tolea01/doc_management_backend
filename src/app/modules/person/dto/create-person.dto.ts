import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { PersonType } from '../types/type.enum';

export class CreatePersonDto {
  @ApiProperty({ example: 'legal', description: 'Person Type' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsEnum(PersonType, {
    message: i18nValidationMessage('validation.INVALID_PERSON_ENUM'),
  })
  type: PersonType;

  @ApiProperty({ example: 'SA INCOMLAC', description: 'Person Name' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @Length(3, 70, {
    message: i18nValidationMessage('validation.MIN_MAX'),
  })
  name: string;

  @ApiProperty({ example: 'str.independentei 23', description: 'address' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @Length(3, 100, {
    message: i18nValidationMessage('validation.MIN_MAX'),
  })
  address: string;

  @ApiProperty({ example: 'mail@mail.com', description: 'Email address' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @IsEmail(
    {},
    {
      message: i18nValidationMessage('validation.INVALID_EMAIL'),
    },
  )
  @Length(6, 70, {
    message: i18nValidationMessage('validation.MIN_MAX'),
  })
  email_address: string;
}
