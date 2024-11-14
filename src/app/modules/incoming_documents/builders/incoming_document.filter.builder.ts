import { Equal } from 'typeorm';

export class IncomingDocumentFilterBuilder {
  constructor(private readonly filter: Record<string, any> = {}) {
    const filterOptions: string[] = [
      'initial_number',
      'number',
      'sender',
      'received',
      'initial_date',
      'date',
      'executor',
      'execution_time',
      'location',
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
