import { EntryDocument } from 'app/modules/entry_documents/entities/entry_document.entity';
import { ExitDocument } from 'app/modules/exit_documents/entities/exit_document.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PersonType } from '../types/type.enum';

@Entity('persons')
export class Person {
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
    type: 'enum',
    enum: PersonType,
  })
  type: PersonType;

  @Column({
    length: 70,
    nullable: false,
  })
  name: string;

  @Column({
    length: 100,
    nullable: false,
  })
  address: string;

  @Column({
    length: 70,
    nullable: false,
  })
  email_address: string;

  @OneToMany(() => EntryDocument, (document: EntryDocument) => document.sender)
  sender_entry_documents: EntryDocument[];

  @OneToMany(
    () => EntryDocument,
    (document: EntryDocument) => document.received,
  )
  received_entry_documents: EntryDocument[];

  @OneToMany(() => ExitDocument, (document: ExitDocument) => document.received)
  received_exit_documents: ExitDocument[];
}
