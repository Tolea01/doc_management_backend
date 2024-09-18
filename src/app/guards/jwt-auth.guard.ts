import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { PUBLIC_ROUTE_KEY } from 'app/common/decorators/auth/public-route.decorator';
import { I18nService } from 'nestjs-i18n';
import { translateMessage } from 'app/utils/translateMessage';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly i18n: I18nService,
  ) {
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

    try {
      await super.canActivate(context);
      return true;
    } catch (error) {
      throw new UnauthorizedException(
        await translateMessage(this.i18n, 'error.unauthorized'),
      );
    }
  }
}
