import { ExitDocument } from 'app/modules/exit_documents/entities/exit_document.entity';
import { InternalDocument } from 'app/modules/internal_documents/entities/internal_document.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EntryDocument } from '../../entry_documents/entities/entry_document.entity';
import { UserRole } from '../roles/role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  created_by: number;

  @Column({ nullable: true })
  updated_by: number;

  @Column({
    type: 'timestamp',
    default: (): string => 'CURRENT_TIMESTAMP(6)',
    precision: 6,
  })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: (): string => 'CURRENT_TIMESTAMP(6)',
    precision: 6,
  })
  updated_at: Date;

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
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  entry_documents_executors: EntryDocument[];

  @ManyToMany(
    () => EntryDocument,
    (document: EntryDocument) => document.coordinators,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  entry_documents_coordinators: EntryDocument[];

  @ManyToMany(
    () => InternalDocument,
    (document: InternalDocument) => document.executors,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  internal_documents_executors: InternalDocument[];

  @ManyToMany(
    () => InternalDocument,
    (document: InternalDocument) => document.coordinators,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  internal_documents_coordinators: InternalDocument[];

  @ManyToMany(
    () => ExitDocument,
    (document: ExitDocument) => document.executors,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  exit_documents_executors: ExitDocument[];
}
