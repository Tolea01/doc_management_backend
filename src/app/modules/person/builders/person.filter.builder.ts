import { Equal } from 'typeorm';

export class PersonFilterBuilder {
  constructor(private readonly filter: Record<string, any> = {}) {
    const filterOptions: string[] = [
      'type',
      'name',
      'address',
      'email_address',
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
