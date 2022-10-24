import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsPositive } from 'class-validator';
import { SortDirection } from '../enums/sort-direction.enum';

export class QueryOptionsDto {
  @IsOptional()
  @IsPositive()
  page: number;

  @IsOptional()
  @IsPositive()
  limit: number;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortDirection: SortDirection;

  @IsOptional()
  keyword: string;

  /**
   * If type is set to boolean it will convert the value to always true
   * because of the enableImplicitConversion under main.ts validationPipe
   * ---
   * Problem Resources:
   * https://stackoverflow.com/questions/59046629/boolean-parameter-in-request-body-is-always-true-in-nestjs-api
   * https://github.com/typestack/class-transformer/issues/306
   **/
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  published: string;
}
