import { Exclude, Expose } from 'class-transformer';

@Expose()
export class UserItemDto {
  id: number;

  name: string;

  surname: string;

  @Exclude()
  password: string;

  role: string;

  photo: string | null;

  phone_number: string;

  email_address: string;
}
