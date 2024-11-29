export default interface IEntryDocumentData {
  entry_number: string;
  number: string;
  entry_date: string;
  date: string;
  sender: number;
  received: number;
  comment: string;
  resolution: string;
  coordinators: number[];
  executors: number[];
  execution_time: string;
  file_path: string;
}
