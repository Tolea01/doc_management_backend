import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import {
  IJwtUserPayload,
  IJwtUserPayloadResponse,
} from 'app/common/interfaces/jwt-user-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCES_TOKEN_KEY'),
    });
  }

  async validate(payload: IJwtUserPayload): Promise<IJwtUserPayloadResponse> {
    const { id, name, surname, email, role } = payload.props;
    return {
      userId: id,
      userName: name,
      userSurname: surname,
      userEmail: email,
      userRole: role,
    };
  }
}
