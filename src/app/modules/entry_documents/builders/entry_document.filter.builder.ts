import { Equal } from 'typeorm';

export class EntryDocumentFilterBuilder {
  constructor(private readonly filter: Record<string, any> = {}) {
    const filterOptions: string[] = [
      'entry_number',
      'number',
      'sender',
      'received',
      'initial_date',
      'date',
      'execution_time',
    ];

    for (const filterOption of filterOptions) {
      if (filter && filter[filterOption] && filter[filterOption].Length) {
        this.filter = Equal(filter[filterOption]);
      }
    }
  }

  public getFilter(): Record<string, any> {
    return this.filter;
  }
}
