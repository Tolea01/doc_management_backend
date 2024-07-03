import { Equal } from 'typeorm';

export class UserFilterBuilder {
  constructor(private readonly filter: Record<string, any> = {}) {
    if (filter && filter.name && filter.name.length) {
      this.filter.name = Equal(filter.name);
    }

    if (filter && filter.surname && filter.surname.length) {
      this.filter.surname = Equal(filter.surname);
    }

    if (filter && filter.role && filter.role.length) {
      this.filter.role = Equal(filter.role);
    }

    if (filter && filter.phone && filter.phone.length) {
      this.filter.phone = Equal(filter.phone_number);
    }

    if (filter && filter.role && filter.role.length) {
      this.filter.role = Equal(filter.role);
    }
  }

  public getFilter(): Record<string, any> {
    return this.filter;
  }
}
