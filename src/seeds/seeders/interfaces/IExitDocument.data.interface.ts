import { Person } from 'app/modules/person/entities/person.entity';
import { User } from 'app/modules/user/entities/user.entity';

export default interface IExitDocumentData {
  number: string;
  date: string;
  comment?: string;
  received: Person;
  execution_time: string;
  executors: User[];
  file_path: string;
}
