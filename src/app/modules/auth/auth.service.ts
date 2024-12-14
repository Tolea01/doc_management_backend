import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IJwtUserPayload } from 'app/common/interfaces/jwt-user-payload.interface';
import { IRefreshTokenCookie } from 'app/common/interfaces/refresh-token-cookie.interface';
import { translateMessage } from 'app/utils/translateMessage';
import { verify } from 'argon2';
import { Response } from 'express';
import { I18nService } from 'nestjs-i18n';
import { UserItemDto } from '../user/dto/user-item.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokensDto } from './dto/tokens.dto';
import { UserLoginPayloadDto } from './dto/user-login.payload.dto';
import { UserLoginResponseDto } from './dto/user-login.response.dto';
import { UserRegisterPayloadDto } from './dto/user-register.payload.dto';
import { UserRegisterResponseDto } from './dto/user-register.response.dto';

@Injectable()
export class AuthService {
  private cookieOptions: IRefreshTokenCookie = {
    httpOnly: true,
    sameSite: 'lax',
    secure:
      this.configService.get<string>('NODE_ENV', 'development') ===
      'production',
    path: '/',
  };

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly i18n: I18nService,
    private readonly configService: ConfigService,
  ) {}

  async registerUser(
    userData: UserRegisterPayloadDto,
    user: any,
  ): Promise<UserRegisterResponseDto> {
    return this.userService.create(userData, user);
  }

  async login(userData: UserLoginPayloadDto): Promise<UserLoginResponseDto> {
    try {
      const existingUser: User | undefined =
        await this.userService.findOneByEmail(userData.email_address);

      const jwtPayload: IJwtUserPayload = {
        props: {
          id: existingUser.id,
          name: existingUser.name,
          surname: existingUser.surname,
          email: existingUser.email_address,
          role: existingUser.role,
        },
        sub: existingUser.id,
      };

      const verifyUserDataPassword: boolean = await verify(
        existingUser.password,
        userData.password,
      );

      if (verifyUserDataPassword) {
        return {
          tokens: await this.generateTokens(jwtPayload),
          user: jwtPayload.props,
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

  async generateTokens(payload: IJwtUserPayload): Promise<TokensDto> {
    try {
      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRE'),
        secret: this.configService.get<string>('ACCESS_TOKEN_KEY'),
      });
      const refreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRE'),
        secret: this.configService.get<string>('REFRESH_TOKEN_KEY'),
      });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new UnauthorizedException(
        await translateMessage(this.i18n, 'error.token_generation_failed'),
      );
    }
  }

  async refreshTokens(oldRefreshTokenDto: RefreshTokenDto): Promise<TokensDto> {
    try {
      const { refreshToken } = oldRefreshTokenDto;
      const decodedUser: any = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN_KEY'),
      });

      const user: UserItemDto | undefined = await this.userService.findOne(
        decodedUser.sub,
      );

      const { props, sub } = decodedUser;
      const userPayload = { props, sub };

      if (!user) {
        throw new UnauthorizedException(
          await translateMessage(this.i18n, 'error.token_generation_failed'),
        );
      }

      return await this.generateTokens(userPayload);
    } catch (error) {
      throw new UnauthorizedException(
        await translateMessage(this.i18n, 'error.token_generation_failed'),
      );
    }
  }

  async setRefreshTokenToCookies(
    refreshToken: string,
    response: Response,
  ): Promise<void> {
    try {
      const { exp } = this.jwtService.decode(refreshToken) as {
        exp: number;
      };

      const refreshTokenCookieName: string = this.configService.get<string>(
        'REFRESH_TOKEN_COOKIES',
      );

      const cookieOptions: IRefreshTokenCookie = {
        ...this.cookieOptions,
        expires: new Date(exp * 1000),
      };

      response.cookie(refreshTokenCookieName, refreshToken, cookieOptions);
    } catch (error) {
      throw new UnauthorizedException(
        await translateMessage(this.i18n, 'error.server_error'),
      );
    }
  }

  async removeRefreshTokenToResponse(response: Response): Promise<void> {
    try {
      const refreshTokenCookieName: string = this.configService.get<string>(
        'REFRESH_TOKEN_COOKIES',
      );

      const cookieOptions: IRefreshTokenCookie = {
        ...this.cookieOptions,
        expires: new Date(0),
      };

      response.cookie(refreshTokenCookieName, '', cookieOptions);
    } catch (error) {
      throw new UnauthorizedException(
        await translateMessage(this.i18n, 'error.server_error', { error }),
      );
    }
  }
}
