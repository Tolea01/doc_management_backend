import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { UserRole } from '../roles/role.enum';
import { IncomingDocument } from '../../incoming_documents/entities/incoming_document.entity';

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
    nullable: false,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column({
    nullable: true,
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

  @ManyToMany(
    () => IncomingDocument,
    (document: IncomingDocument) => document.executors,
    {
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  )
  incoming_documents: IncomingDocument[];
}
