import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { UserRole } from '../roles/role.enum';

export class UserFilterDto {
  @ApiProperty({ example: 'filter[name]=john', description: 'filter by name' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  name: string;

  @ApiProperty({
    example: 'filter[surname]=johns',
    description: 'filter by surname',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  surname: string;

  @ApiProperty({
    example: 'filter[role]=admin',
    description: 'filter by role',
    enum: UserRole,
    enumName: 'UserRole',
  })
  @IsOptional()
  @IsEnum(UserRole, {
    message: i18nValidationMessage('validation.INVALID_USER_ENUM'),
  })
  role: UserRole;

  @ApiProperty({
    example: 'filter[phone]=069747583',
    description: 'filter by phone number',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.INVALID_STRING') })
  phone: string;
}
