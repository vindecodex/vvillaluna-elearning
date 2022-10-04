import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { CookieAuthGuard } from 'src/shared/guards/cookie-auth.guard';
import { ResponseList } from 'src/shared/interfaces/response-list.interface';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { User } from '../entities/user.entity';
import { UserService } from '../service/user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  @UseGuards(CookieAuthGuard)
  findAll(
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<ResponseList<User>> {
    return this.userService.findAll(paginationQueryDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | object> {
    return this.userService.findOne(id);
  }
}
