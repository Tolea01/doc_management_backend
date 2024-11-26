export default interface IPagination<Entity> {
  data: Entity[];
  total: number;
  page: number;
  limit: number;
}
