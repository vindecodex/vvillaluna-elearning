import { PartialType } from '@nestjs/swagger';
import { QueryOptionsDto } from '../../shared/dto/query-options.dto';

export class UserQueryDto extends PartialType(QueryOptionsDto) {}
