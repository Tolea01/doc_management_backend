import { EntryDocument } from 'app/modules/entry_documents/entities/entry_document.entity';
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

  entry_documents?: EntryDocument[];
}
