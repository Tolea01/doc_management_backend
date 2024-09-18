import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from '../user/user.service';
import { UserItemDto } from '../user/dto/user-item.dto';
import { I18nService } from 'nestjs-i18n';
import { translateMessage } from '../../utils/translateMessage';
import { config as dotEnvConfig } from 'dotenv';
import {
  IJwtUserPayload,
  IJwtUserPayloadResponse,
} from 'app/common/interfaces/jwt-user-payload.interface';

dotEnvConfig();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private i18n: I18nService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_KEY,
    });
  }

  async validate(payload: IJwtUserPayload): Promise<IJwtUserPayloadResponse> {
    const { id, name, surname, email, role } = payload.props;
    const { sub } = payload;
    const user: UserItemDto | undefined = await this.userService.findOne(sub);

    if (!user) {
      throw new UnauthorizedException(
        await translateMessage(this.i18n, 'error.unauthorized'),
      );
    }

    return {
      userId: id,
      userName: name,
      userSurname: surname,
      userEmail: email,
      userRole: role,
    };
  }
}
