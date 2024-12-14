import { Equal } from 'typeorm';

export class ExitDocumentFilterBuilder {
  constructor(private readonly filter: Record<string, any> = {}) {
    const filterOptions: string[] = [
      'number',
      'date',
      'execution_time',
      'received',
      'created_by',
      'updated_by',
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
