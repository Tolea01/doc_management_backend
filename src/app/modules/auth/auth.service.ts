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
import { ConfigService } from '@nestjs/config';
import { UserItemDto } from '../user/dto/user-item.dto';
import { IJwtUserPayload } from 'app/common/interfaces/jwt-user-payload.interface';
import { TokenResponseDto } from './dto/tokens.response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Response } from 'express';
import { IRefreshTokenCookie } from 'app/common/interfaces/refresh-token-cookie.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly i18n: I18nService,
    private readonly configService: ConfigService,
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
        return await this.generateTokens(jwtPayload);
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

  async generateTokens(payload: IJwtUserPayload): Promise<TokenResponseDto> {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRE'),
      secret: this.configService.get<string>('ACCESS_TOKEN_KEY'),
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRE'),
      secret: this.configService.get<string>('REFRESH_TOKEN_KEY'),
    });

    return { accessToken, refreshToken };
  }

  async refreshTokens(
    oldRefreshTokenDto: RefreshTokenDto,
  ): Promise<TokenResponseDto> {
    const { oldRefreshToken } = oldRefreshTokenDto;
    const decodedUser: any = await this.jwtService.verifyAsync(
      oldRefreshToken,
      {
        secret: this.configService.get<string>('REFRESH_TOKEN_KEY'),
      },
    );

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
  }

  async setRefreshTokenToCookies(
    tokens: TokenResponseDto,
    response: Response,
  ): Promise<void> {
    const { exp } = this.jwtService.decode(tokens.refreshToken) as {
      exp: number;
    };

    const refreshTokenCookieName: string = this.configService.get<string>(
      'REFRESH_TOKEN_COOKIES',
    );

    const cookieOptions: IRefreshTokenCookie = {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(exp * 1000),
      secure:
        this.configService.get<string>('NODE_ENV', 'development') ===
        'production',
      path: '/',
    };

    response.cookie(refreshTokenCookieName, tokens.refreshToken, cookieOptions);
  }
}
