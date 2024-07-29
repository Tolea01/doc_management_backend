import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { config as dotenvConfig } from 'dotenv';
import {
  IJwtUserPayload,
  IJwtUserPayloadResponse,
} from 'app/common/interfaces/jwt-user-payload.interface';

dotenvConfig();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
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
