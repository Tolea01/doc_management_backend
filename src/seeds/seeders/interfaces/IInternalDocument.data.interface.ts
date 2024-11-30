import { User } from 'app/modules/user/entities/user.entity';

export default interface IInternalDocumentData {
  number: string;
  date: string;
  comment?: string;
  resolution: string;
  execution_time: string;
  coordinators: User[];
  executors: User[];
  file_path: string;
}
