import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class UserUpdatePasswordDto {
  @ApiProperty({ example: 'kdTmbVF%!D', description: 'Password' })
  @IsNotEmpty()
  @IsString()
  @Length(8, 64, {
    message: 'Password must contain [$constraint1, constraint2 characters]',
  })
  old_password: string;

  @ApiProperty({ example: 'kdTmbVF%!D', description: 'Password' })
  @IsNotEmpty()
  @IsString()
  @Length(8, 64, {
    message: 'Password must contain [$constraint1, constraint2 characters]',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password to weak',
  })
  new_password: string;

  @ApiProperty({ example: 'kdTmbVF%!D', description: 'Password' })
  @IsNotEmpty()
  @IsString()
  @Length(8, 64, {
    message: 'Password must contain [$constraint1, constraint2 characters]',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password to weak',
  })
  new_password_confirmation: string;
}
