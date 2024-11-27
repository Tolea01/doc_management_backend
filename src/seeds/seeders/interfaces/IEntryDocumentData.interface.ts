export default interface IEntryDocumentData {
  initial_number: string;
  number: string;
  sender: number;
  comment?: string;
  received: number;
  initial_date: string;
  date: string;
  executors: number[];
  execution_time: string;
  location: string;
}
