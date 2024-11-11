import { UserRole } from 'app/modules/user/roles/role.enum';

export default interface IUserData {
  name: string;
  surname: string;
  password: string;
  role: UserRole;
  photo: string;
  phone_number: string;
  email_address: string;
}
