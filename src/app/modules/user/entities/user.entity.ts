import { ExitDocument } from 'app/modules/exit_documents/entities/exit_document.entity';
import { InternalDocument } from 'app/modules/internal_documents/entities/internal_document.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EntryDocument } from '../../entry_documents/entities/entry_document.entity';
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
    () => EntryDocument,
    (document: EntryDocument) => document.executors,
    {
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  )
  entry_documents_executors: EntryDocument[];

  @ManyToMany(
    () => EntryDocument,
    (document: EntryDocument) => document.coordinators,
    {
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  )
  entry_documents_coordinators: EntryDocument[];

  @ManyToMany(
    () => InternalDocument,
    (document: InternalDocument) => document.executors,
    {
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  )
  internal_documents_executors: InternalDocument[];

  @ManyToMany(
    () => InternalDocument,
    (document: InternalDocument) => document.coordinators,
    {
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  )
  internal_documents_coordinators: InternalDocument[];

  @ManyToMany(
    () => ExitDocument,
    (document: ExitDocument) => document.executors,
    {
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  )
  exit_documents_executors: ExitDocument[];
}
