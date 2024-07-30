import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PUBLIC_ROUTE_KEY } from 'app/common/decorators/auth/public-route.decorator';
import { ROLES_KEY } from 'app/common/decorators/auth/roles.decorator';
import { UserRole } from 'app/modules/user/roles/role.enum';
import { I18nService } from 'nestjs-i18n';
import { translateMessage } from 'app/utils/translateMessage';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly i18n: I18nService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    const isPublicRoute = this.reflector.get<string>(
      PUBLIC_ROUTE_KEY,
      context.getHandler(),
    );
    const { user } = context.switchToHttp().getRequest();

    if (!roles || isPublicRoute || roles.includes(UserRole.ALL)) {
      return true;
    }

    if (!user.userRole || !RolesGuard.matchRoles(roles, user.userRole)) {
      const message = await translateMessage(this.i18n, 'error.unauthorized');
      throw user.userRole
        ? new ForbiddenException(message)
        : new UnauthorizedException(message);
    }

    return true;
  }

  private static matchRoles(roles: string[], userRole: string): boolean {
    return roles.includes(userRole);
  }
}
