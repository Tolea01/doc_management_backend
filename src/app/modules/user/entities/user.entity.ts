import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserRole } from '../roles/role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 60,
    nullable: false,
  })
  name: string;

  @Column({
    length: 60,
    nullable: false,
  })
  surname: string;

  @Column({
    length: 64,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column({
    length: 255,
  })
  photo: string;

  @Column({
    length: 15,
    nullable: false,
    unique: true,
  })
  phone_number: string;

  @Column({
    length: 60,
    nullable: false,
    unique: true,
  })
  email_address: string;
}
