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

  @Column({ type: 'date' })
  execution_time: string;

  @Column({ type: 'text' })
  file_path: string;

  @ManyToOne(() => Person, (person: Person) => person.received_exit_documents, {
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'received_id' })
  received: Person;

  @ManyToMany(() => User, (user: User) => user.exit_documents_executors, {
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'executors_exit_documents',
  })
  executors: User[];
}
