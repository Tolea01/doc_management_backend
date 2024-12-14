import { PersonType } from 'app/modules/person/types/type.enum';

export default interface IPersonData {
  type: PersonType;
  name: string;
  address: string;
  email_address: string;
  created_by: number;
}
