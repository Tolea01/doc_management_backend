import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRegisterPayloadDto } from './dto/user.register.payload.dto';
import { UserRegisterResponseDto } from './dto/user-register.response.dto';
import { UserLoginPayloadDto } from './dto/user-login.payload.dto';
import { UserLoginResponseDto } from './dto/user-login.response.dto';

@ApiBearerAuth()
@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @Post('register')
  async registerUser(
    @Body() userData: UserRegisterPayloadDto,
  ): Promise<UserRegisterResponseDto> {
    return this.authService.registerUser(userData);
  }

  @ApiOperation({ summary: 'Login user' })
  @Post('login')
  async login(
    @Body() userData: UserLoginPayloadDto,
  ): Promise<UserLoginResponseDto> {
    return this.authService.login(userData);
  }
}
