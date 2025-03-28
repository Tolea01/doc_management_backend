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

@Entity('exit_documents')
export class ExitDocument {
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

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  // @Column({ type: 'date' })
  // execution_time: string;

  @Column({ type: 'text' })
  file_path: string;

  @ManyToOne(() => Person, (person: Person) => person.received_exit_documents, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'received_id' })
  received: Person;

  @ManyToMany(() => User, (user: User) => user.exit_documents_executors, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'executors_exit_documents',
  })
  executors: User[];
}
