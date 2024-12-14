import { Person } from 'app/modules/person/entities/person.entity';
import { User } from 'app/modules/user/entities/user.entity';

export default interface IEntryDocumentData {
  entry_number: string;
  number: string;
  entry_date: string;
  date: string;
  sender: Person;
  received: Person;
  comment?: string;
  resolution: string;
  coordinators: User[];
  executors: User[];
  execution_time: string;
  file_path: string;
  created_by: number;
}
