export const ROLES_KEY = 'roles';
import { UserRole } from 'app/modules/user/roles/role.enum';
import { SetMetadata } from '@nestjs/common';

export const Role = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
