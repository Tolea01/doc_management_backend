import { Person } from 'app/modules/person/entities/person.entity';
import { User } from 'app/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DocumentStatus } from 'app/common/enums/document-status.enum';

@Entity('entry_documents')
export class EntryDocument {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    length: 55,
    nullable: false,
    unique: true,
  })
  number: string;

  @Column({
    length: 55,
    nullable: false,
  })
  entry_number: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'date' })
  entry_date: string;

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.IN_WORK,
  })
  status: DocumentStatus;

  @ManyToOne(() => Person, (person) => person.sentDocuments, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'sender_id' })
  sender: Person;

  @ManyToOne(() => Person, (person) => person.receivedDocuments, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'received_id' })
  received: Person;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column({ length: 55, nullable: false })
  resolution: string;

  @Column({ type: 'date' })
  execution_time: string;

  @Column({ type: 'text' })
  file_path: string;

  @ManyToMany(() => User, (user: User) => user.entry_documents_coordinators, {
    onUpdate: 'CASCADE',
  })
  @JoinTable({ name: 'coordinators_entry_documents' })
  coordinators: User[];

  @ManyToMany(() => User, (user: User) => user.entry_documents_executors, {
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'executors_entry_documents',
  })
  executors: User[];
}
