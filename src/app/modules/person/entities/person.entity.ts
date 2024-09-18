import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
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
}
