import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsPositive } from 'class-validator';
import { Pagination } from '../enums/pagination.enum';
import { SortDirection } from '../enums/sort-direction.enum';
import { toBoolean } from '../helpers/to-boolean.helper';

export class QueryOptionsDto {
  @IsOptional()
  @IsPositive()
  @ApiProperty({
    description: `Requested page number. Default value is ${Pagination.DEFAULT_PAGE}.`,
    default: Pagination.DEFAULT_PAGE,
  })
  page: number = Pagination.DEFAULT_PAGE;

  @IsOptional()
  @IsPositive()
  @ApiProperty({
    description: `Number of results to return. Default value is ${Pagination.DEFAULT_LIMIT}.`,
    default: Pagination.DEFAULT_LIMIT,
  })
  limit: number = Pagination.DEFAULT_LIMIT;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  @ApiProperty({
    description: `Describes the direction of the sort. Possible values are “ASC” and “DESC”.`,
    default: SortDirection.ASC,
  })
  sortDirection: SortDirection;

  @IsOptional()
  @ApiProperty({
    description: 'Keyword to search',
  })
  keyword: string;

  /**
   * If type is set to boolean it will convert the value to always true
   * because of the enableImplicitConversion under main.ts validationPipe
   * ---
   * Problem Resources:
   * https://stackoverflow.com/questions/59046629/boolean-parameter-in-request-body-is-always-true-in-nestjs-api
   * https://github.com/typestack/class-transformer/issues/306
   **/
  @Transform(toBoolean)
  @IsOptional()
  @ApiProperty({
    description: 'To filter published or still in draft subjects.',
  })
  published = 'true';
}
