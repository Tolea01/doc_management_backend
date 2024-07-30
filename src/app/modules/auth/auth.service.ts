import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserRegisterPayloadDto } from './dto/user.register.payload.dto';
import { UserRegisterResponseDto } from './dto/user-register.response.dto';
import { UserLoginPayloadDto } from './dto/user-login.payload.dto';
import { UserLoginResponseDto } from './dto/user-login.response.dto';
import { verify } from 'argon2';
import { User } from '../user/entities/user.entity';
import { I18nService } from 'nestjs-i18n';
import { translateMessage } from 'app/utils/translateMessage';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly i18n: I18nService,
  ) {}

  async registerUser(
    userData: UserRegisterPayloadDto,
  ): Promise<UserRegisterResponseDto> {
    return this.userService.create(userData);
  }

  async login(userData: UserLoginPayloadDto): Promise<UserLoginResponseDto> {
    try {
      const existingUser: User | undefined =
        await this.userService.findOneByEmail(userData.email_address);

      const verifyUserDataPassword: boolean = await verify(
        existingUser.password,
        userData.password,
      );

      if (verifyUserDataPassword) {
        return {
          token: this.jwtService.sign({
            props: {
              id: existingUser.id,
              name: existingUser.name,
              surname: existingUser.surname,
              email: existingUser.email_address,
              role: existingUser.role,
            },
            sub: existingUser.id,
          }),
        };
      } else {
        throw new UnauthorizedException(
          await translateMessage(this.i18n, 'error.invalid_credentials'),
        );
      }
    } catch (error) {
      throw new UnauthorizedException(
        await translateMessage(this.i18n, 'error.invalid_credentials'),
      );
    }
  }
}
