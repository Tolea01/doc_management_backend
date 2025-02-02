import IpaginatorConfig from 'app/common/interfaces/IpaginatorConfig.interface';

const paginationConfig: IpaginatorConfig = {
  page: 1,
  limit: 25,
  sortOrder: 'ASC',
  sortColumn: 'id',
};

export default paginationConfig;
