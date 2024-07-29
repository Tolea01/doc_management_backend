import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PUBLIC_ROUTE_KEY } from 'app/common/decorators/auth/public-route.decorator';
import { ROLES_KEY } from 'app/common/decorators/auth/roles.decorator';
import { UserRole } from 'app/modules/user/roles/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

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

    if (!user.userRole) {
      throw new UnauthorizedException();
    }

    return RolesGuard.matchRoles(roles, user.userRole);
  }

  private static matchRoles(roles: string[], userRole: string): boolean {
    return roles.includes(userRole);
  }
}
