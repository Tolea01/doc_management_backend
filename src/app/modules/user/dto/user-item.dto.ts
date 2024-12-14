import { Exclude, Expose } from 'class-transformer';

@Expose()
export class UserItemDto {
  @Exclude()
  password: string;
}
