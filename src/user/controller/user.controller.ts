import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { ReadUserPolicyHandler } from '../../authorization/policy-handler/user/read-user-policy.handler';
import { CheckPolicies } from '../../shared/decorators/check-policies.decorator';
import { PoliciesGuard } from '../../shared/guards/policies.guard';
import { ResponseList } from '../../shared/interfaces/response-list.interface';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { User } from '../entities/user.entity';
import { UserService } from '../service/user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(ReadUserPolicyHandler)
  findAll(
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<ResponseList<User>> {
    return this.userService.findAll(paginationQueryDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(ReadUserPolicyHandler)
  findOne(@Param('id') id: string): Promise<User | object> {
    return this.userService.findOne(id);
  }
}
