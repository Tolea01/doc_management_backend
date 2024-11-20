import { IncomingDocument } from 'app/modules/incoming_documents/entities/incoming_document.entity';
import { Exclude, Expose } from 'class-transformer';
import { UserRole } from '../roles/role.enum';

@Expose()
export class UserItemDto {
  id: number;

  name: string;

  surname: string;

  @Exclude()
  password: string;

  role: UserRole;

  photo: string | null;

  phone_number: string;

  email_address: string;

  incoming_documents?: IncomingDocument[];
}
