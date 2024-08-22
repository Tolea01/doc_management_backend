import { PersonType } from 'app/modules/person/types/type.enum';
import { User } from 'app/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('incoming_documents')
export class IncomingDocument {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    length: 55,
    nullable: false,
  })
  initial_number: string;

  @Column({
    length: 55,
    nullable: false,
    unique: true,
  })
  number: string;

  @Column({ type: 'enum', enum: PersonType })
  sender: PersonType;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column({ type: 'enum', enum: PersonType })
  received: PersonType;

  @Column({ type: 'date' })
  initial_date: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'date' })
  execution_time: string;

  @Column({ length: 255 })
  location: string;

  @ManyToMany(() => User, (user: User) => user.incoming_documents, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'user_incoming_document',
    joinColumn: { name: 'incoming_document_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  executors: User[];
}
