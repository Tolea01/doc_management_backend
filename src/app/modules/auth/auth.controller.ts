import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PublicRoute } from 'app/common/decorators/auth/public-route.decorator';
import { Role } from 'app/common/decorators/auth/roles.decorator';
import ApiLanguageHeader from 'app/common/decorators/swagger/language-header';
import { Request, Response } from 'express';
import { UserRole } from '../user/roles/role.enum';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokensDto } from './dto/tokens.dto';
import { UserLoginPayloadDto } from './dto/user-login.payload.dto';
import { UserLoginResponseDto } from './dto/user-login.response.dto';
import { UserRegisterPayloadDto } from './dto/user-register.payload.dto';
import { UserRegisterResponseDto } from './dto/user-register.response.dto';

@ApiTags('Authentification')
@ApiLanguageHeader()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Role(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Requires ADMIN role to create a new user',
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully registered',
  })
  async registerUser(
    @Body() userData: UserRegisterPayloadDto,
    @Req() request: Request,
  ): Promise<UserRegisterResponseDto> {
    return this.authService.registerUser(userData, request.user);
  }

  @Post('login')
  @PublicRoute()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Login user',
    description: 'This is a public route',
  })
  @ApiResponse({ status: 200, description: 'User has successfully logged in' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'User is not registered' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async login(
    @Body() userData: UserLoginPayloadDto,
    @Res() res: Response,
  ): Promise<void> {
    const loggedUser: UserLoginResponseDto =
      await this.authService.login(userData);

    await this.authService.setRefreshTokenToCookies(
      loggedUser.tokens.refreshToken,
      res,
    );

    res.status(HttpStatus.OK).json({
      user: loggedUser.user,
      accessToken: loggedUser.tokens.accessToken,
    });
  }

  @Get('me')
  @Role(UserRole.ALL)
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401 })
  @ApiResponse({ status: 500 })
  async getUserInfo(@Req() req: Request) {
    return req.user;
  }

  @Post('refresh-tokens')
  @Role(UserRole.ALL)
  @ApiOperation({
    summary: 'Generate new tokens',
  })
  @ApiResponse({
    status: 200,
    description: 'Tokens have been successfully generated',
  })
  @ApiResponse({ status: 500, description: 'Server error' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async refreshTokens(
    @Body() oldRefreshTokenDto: RefreshTokenDto,
    @Res() res: Response,
  ): Promise<void> {
    const tokens: TokensDto =
      await this.authService.refreshTokens(oldRefreshTokenDto);
    await this.authService.setRefreshTokenToCookies(tokens.refreshToken, res);

    res.status(HttpStatus.OK).json({ accessToken: tokens.accessToken });
  }

  @Post('logout')
  @Role(UserRole.ALL)
  @HttpCode(200)
  @ApiOperation({
    summary: 'logging out',
  })
  @ApiResponse({
    status: 200,
  })
  @ApiResponse({ status: 500, description: 'Server error' })
  logout(@Res() response: Response): boolean {
    this.authService.removeRefreshTokenToResponse(response);

    return true;
  }
}
