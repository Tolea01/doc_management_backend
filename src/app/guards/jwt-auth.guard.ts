import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { PUBLIC_ROUTE_KEY } from 'app/common/decorators/auth/public-route.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublicRoute = this.reflector.get<string>(
      PUBLIC_ROUTE_KEY,
      context.getHandler(),
    );

    if (isPublicRoute) {
      return true;
    }

    return super.canActivate(context) as Promise<boolean>;
  }
}
