import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UserUpdatePasswordDto {
  @ApiProperty({ example: 'kdTmbVF%!D', description: 'Password' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @Length(8, 64, {
    message: i18nValidationMessage('validation.MIN_MAX'),
  })
  old_password: string;

  @ApiProperty({ example: 'kdTmbVF%!D', description: 'Password' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @Length(8, 64, {
    message: i18nValidationMessage('validation.MIN_MAX'),
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password to weak',
  })
  new_password: string;

  @ApiProperty({ example: 'kdTmbVF%!D', description: 'Password' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  @Length(8, 64, {
    message: i18nValidationMessage('validation.MIN_MAX'),
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password to weak',
  })
  new_password_confirmation: string;
}
