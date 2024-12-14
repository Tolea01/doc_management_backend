import { DocumentStatus } from 'app/common/enums/document-status.enum';
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

@Entity('entry_documents')
export class EntryDocument {
  @PrimaryGeneratedColumn('increment')
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

  @ManyToOne(() => Person, (person) => person.sender_entry_documents, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'sender_id' })
  sender: Person;

  @ManyToOne(() => Person, (person) => person.received_entry_documents, {
    onDelete: 'CASCADE',
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
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'coordinators_entry_documents' })
  coordinators: User[];

  @ManyToMany(() => User, (user: User) => user.entry_documents_executors, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'executors_entry_documents',
  })
  executors: User[];
}
