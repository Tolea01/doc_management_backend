import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { UserRole } from '../roles/role.enum';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'Name' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @Length(3, 60, {
    message: i18nValidationMessage('validation.MIN_MAX'),
  })
  name: string;

  @ApiProperty({ example: 'Doe', description: 'Surname' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @Length(3, 60, {
    message: i18nValidationMessage('validation.MIN_MAX'),
  })
  surname: string;

  @ApiProperty({ example: 'password', description: 'Password' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @Length(8, 64, {
    message: i18nValidationMessage('validation.MIN_MAX'),
  })
  password: string;

  @ApiProperty({ example: 'admin', description: 'User role' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsEnum(UserRole, {
    message: i18nValidationMessage('validation.INVALID_USER_ENUM'),
  })
  role: UserRole;

  @ApiProperty({ required: false, example: 'photo', description: 'photo' })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @IsOptional()
  photo: string;

  @ApiProperty({ example: '0689493942', description: 'Phone number' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @Length(9, 15, {
    message: i18nValidationMessage('validation.MIN_MAX'),
  })
  phone_number: string;

  @ApiProperty({ example: 'mail@mail.com', description: 'Email address' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @IsEmail(
    {},
    {
      message: i18nValidationMessage('validation.INVALID_EMAIL'),
    },
  )
  @Length(6, 60, {
    message: i18nValidationMessage('validation.MIN_MAX'),
  })
  email_address: string;
}
