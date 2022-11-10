import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { ReadUserPolicyHandler } from '../../authorization/policy-handler/user/read-user-policy.handler';
import { CheckPolicies } from '../../shared/decorators/check-policies.decorator';
import { PoliciesGuard } from '../../shared/guards/policies.guard';
import { ResponseList } from '../../shared/interfaces/response-list.interface';
import { User } from '../entities/user.entity';
import { UserService } from '../service/user.service';
import { UserQueryDto } from '../dto/user-query.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(ReadUserPolicyHandler)
  findAll(@Query() dto: UserQueryDto): Promise<ResponseList<User>> {
    return this.userService.findAll(dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(ReadUserPolicyHandler)
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }
}
