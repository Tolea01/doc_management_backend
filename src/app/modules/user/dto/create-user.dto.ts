import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { UserRole } from '../roles/role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'Name' })
  @IsNotEmpty()
  @IsString()
  @Length(3, 60, {
    message: 'name must contain [$constraint1, $constraint2] characters',
  })
  name: string;

  @ApiProperty({ example: 'Doe', description: 'Surname' })
  @IsNotEmpty()
  @IsString()
  @Length(3, 60, {
    message: 'surname must contain [$constraint1, $constraint2] characters',
  })
  surname: string;

  @ApiProperty({ example: 'password', description: 'Password' })
  @IsNotEmpty()
  @IsString()
  @Length(8, 64, {
    message: 'password must contain [$constraint1, $constraint2] characters',
  })
  password: string;

  @ApiProperty({ example: 'admin', description: 'User role' })
  @IsNotEmpty()
  role: UserRole;

  @ApiProperty({ required: false, example: 'photo', description: 'photo' })
  @IsString()
  @IsOptional()
  photo: string;

  @ApiProperty({ example: '0689493942', description: 'Phone number' })
  @IsNotEmpty()
  @IsString()
  @Length(9, 15, {
    message:
      'phone number must contain [$constraint1, $constraint2] characters',
  })
  phone_number: string;

  @ApiProperty({ example: 'mail@mail.com', description: 'Email address' })
  @IsNotEmpty()
  @IsString()
  @IsEmail(
    {},
    {
      message: 'email address must be a valid email',
    },
  )
  @Length(6, 60, {
    message:
      'email address must contain [$constraint1, $constraint2] characters',
  })
  email_address: string;
}
