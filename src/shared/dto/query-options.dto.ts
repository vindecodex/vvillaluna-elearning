import { IsOptional, IsPositive } from 'class-validator';

export class QueryOptionsDto {
  @IsOptional()
  @IsPositive()
  page: number;

  @IsOptional()
  @IsPositive()
  limit: number;

  @IsOptional()
  sort: string;

  @IsOptional()
  sortDirection: string;

  @IsOptional()
  join: string[];

  @IsOptional()
  keyword: string;

  @IsOptional()
  published: boolean;
}
