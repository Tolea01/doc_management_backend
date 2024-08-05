import { UserRole } from 'app/modules/user/roles/role.enum';

export interface IJwtUserPayload {
  props: {
    id: number;
    name: string;
    surname: string;
    email: string;
    role: UserRole;
  };
  sub: number;
}

export interface IJwtUserPayloadResponse {
  userId: number;
  userName: string;
  userSurname: string;
  userEmail: string;
  userRole: UserRole;
}
