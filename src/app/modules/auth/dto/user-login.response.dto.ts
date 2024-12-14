import { ApiProperty } from '@nestjs/swagger';
import { IJwtUserPayloadProps } from 'app/common/interfaces/jwt-user-payload.interface';
import { TokensDto } from './tokens.dto';

export class UserLoginResponseDto {
  @ApiProperty({
    type: TokensDto,
    description: 'The tokens generated for the user session.',
  })
  tokens: TokensDto;

  @ApiProperty({
    description: 'Details of the authenticated user.',
  })
  user: IJwtUserPayloadProps;
}
