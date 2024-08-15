import { Equal } from 'typeorm';

export class PersonFilterBuilder {
  constructor(private readonly filter: Record<string, any>) {
    // if (filter && filter.type && filter.type.length) {
    //   this.filter.type = Equal(filter.type);
    // }

    // if (filter && filter.name && filter.name.length) {
    //   this.filter.name = Equal(filter.name);
    // }

    // if (filter && filter.address && filter.address.length) {
    //   this.filter.address = Equal(filter.address);
    // }

    // if (filter && filter.email && filter.email.length) {
    //   this.filter.email = Equal(filter.email_address);
    // }

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
