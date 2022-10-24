import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { ResponseList } from 'src/shared/interfaces/response-list.interface';
import { User } from 'src/user/entities/user.entity';
import { CreateModuleDto } from '../dto/create-module.dto';
import { ModuleQueryDto } from '../dto/module-query.dto';
import { UpdateModuleDto } from '../dto/update-module.dto';
import { Module } from '../entities/module.entity';
import { ModuleService } from '../service/module.service';

@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createModuleDto: CreateModuleDto,
    @GetUser() user: User,
  ): Promise<Module> {
    return this.moduleService.create(createModuleDto, user);
  }

  @Get()
  findAll(
    @Query() moduleQueryDto: ModuleQueryDto,
  ): Promise<ResponseList<Module>> {
    return this.moduleService.findAll(moduleQueryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Module | object> {
    return this.moduleService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateModuleDto: UpdateModuleDto,
  ): Promise<Module> {
    return this.moduleService.update(+id, updateModuleDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string): Promise<void> {
    return this.moduleService.delete(+id);
  }
}
