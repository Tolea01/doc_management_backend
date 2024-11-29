import { DocumentStatus } from 'app/modules/entry_documents/status/status.enum';
import { User } from 'app/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('internal_documents')
export class InternalDocument {
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

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.IN_WORK,
  })
  status: DocumentStatus;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column({ length: 55, nullable: false })
  resolution: string;

  @Column({ type: 'date' })
  execution_time: string;

  @Column({ type: 'text' })
  file_path: string;

  @ManyToMany(
    () => User,
    (user: User) => user.internal_documents_coordinators,
    {
      onUpdate: 'CASCADE',
    },
  )
  @JoinTable({ name: 'coordinators_internal_documents' })
  coordinators: User[];

  @ManyToMany(() => User, (user: User) => user.internal_documents_executors, {
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'executors_internal_documents',
  })
  executors: User[];
}
