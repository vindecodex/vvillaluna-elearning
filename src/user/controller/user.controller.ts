import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppAbility } from 'src/authorization/casl-ability.factory';
import { Action } from 'src/authorization/enums/action.enum';
import { CheckPolicies } from 'src/shared/decorators/check-policies.decorator';
import { PoliciesGuard } from 'src/shared/guards/policies.guard';
import { ResponseList } from 'src/shared/interfaces/response-list.interface';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { User } from '../entities/user.entity';
import { UserService } from '../service/user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  findAll(
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<ResponseList<User>> {
    return this.userService.findAll(paginationQueryDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.READ, User))
  async findOne(@Param('id') id: string): Promise<User | object> {
    return this.userService.findOne(id);
  }
}
