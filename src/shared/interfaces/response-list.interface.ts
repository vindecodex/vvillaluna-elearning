export interface ResponseList<T> {
  data: Array<T>;
  totalCount: number;
  page: number;
  limit: number;
}
