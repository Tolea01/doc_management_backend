// import { ApiProperty } from '@nestjs/swagger';
// import { UserRole } from 'app/modules/user/roles/role.enum';

import { UserItemDto } from 'app/modules/user/dto/user-item.dto';

// export class UserRegisterResponseDto {
//   @ApiProperty({
//     example: 'mymail@mail.com',
//     description: 'User email address',
//   })
//   email_address: string;

//   @ApiProperty({ example: 'admin', description: 'User Role' })
//   role: UserRole;
// }

export class UserRegisterResponseDto extends UserItemDto {}
