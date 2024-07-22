import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserRegisterPayloadDto } from './dto/user.register.payload.dto';
import { UserRegisterResponseDto } from './dto/user-register.response.dto';
import { UserLoginPayloadDto } from './dto/user-login.payload.dto';
import { UserLoginResponseDto } from './dto/user-login.response.dto';
import { verify } from 'argon2';
// import { UserItemDto } from '../user/dto/user-item.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(
    userData: UserRegisterPayloadDto,
  ): Promise<UserRegisterResponseDto> {
    return this.userService.create(userData);
  }

  async login(userData: UserLoginPayloadDto): Promise<UserLoginResponseDto> {
    let validCredentials: boolean = false;

    try {
      const existingUser: User | undefined =
        await this.userService.findOneByEmail(userData.email_address);
      const passwordMatch: boolean = await verify(
        userData.password,
        existingUser.password,
      );

      if (existingUser && passwordMatch) {
        validCredentials = true;
      }

      if (validCredentials) {
        return {
          token: this.jwtService.sign({
            props: {
              id: existingUser.id,
              name: existingUser.name,
              surname: existingUser.surname,
              email: existingUser.email_address,
              role: existingUser.role,
            },
          }),
        };
      }
    } catch (error) {
      throw new UnauthorizedException(`Invalid credentials. ${error.message}`);
    }
  }
}
