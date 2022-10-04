import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { CookieAuthGuard } from 'src/shared/guards/cookie-auth.guard';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { UserService } from '../service/user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  @UseGuards(CookieAuthGuard)
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.userService.findAll(paginationQueryDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
