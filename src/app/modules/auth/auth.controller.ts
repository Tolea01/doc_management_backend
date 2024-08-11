import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRegisterPayloadDto } from './dto/user.register.payload.dto';
import { UserRegisterResponseDto } from './dto/user-register.response.dto';
import { UserLoginPayloadDto } from './dto/user-login.payload.dto';
import { UserLoginResponseDto } from './dto/user-login.response.dto';
import { Role } from 'app/common/decorators/auth/roles.decorator';
import { UserRole } from '../user/roles/role.enum';
import { PublicRoute } from 'app/common/decorators/auth/public-route.decorator';
import ApiLanguageHeader from 'app/common/decorators/swagger/language-header';
import { RefreshTokenDto } from './dto/refresh-token.dto';

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
  ): Promise<UserRegisterResponseDto> {
    return this.authService.registerUser(userData);
  }

  @Post('login')
  @PublicRoute()
  @HttpCode(200)
  @ApiOperation({
    summary: 'Login user',
    description: 'This is a public route',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'User is not registered' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async login(
    @Body() userData: UserLoginPayloadDto,
  ): Promise<UserLoginResponseDto> {
    return this.authService.login(userData);
  }

  @Post('refresh-tokens')
  @Role(UserRole.ALL)
  @HttpCode(200)
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
  ): Promise<UserLoginResponseDto> {
    return this.authService.refreshTokens(oldRefreshTokenDto);
  }
}
