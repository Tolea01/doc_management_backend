import { EntryDocument } from 'app/modules/entry_documents/entities/entry_document.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PersonType } from '../types/type.enum';

@Entity('persons')
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

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
  sentDocuments: EntryDocument[];

  @OneToMany(
    () => EntryDocument,
    (document: EntryDocument) => document.received,
  )
  receivedDocuments: EntryDocument[];
}
