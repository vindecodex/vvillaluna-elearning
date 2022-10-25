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
import { CreateModulePolicyHandler } from 'src/authorization/policy-handler/module/create-module-policy.handler';
import { DeleteModulePolicyHandler } from 'src/authorization/policy-handler/module/delete-module-policy.handler';
import { ReadModulePolicyHandler } from 'src/authorization/policy-handler/module/read-module-policy.handler';
import { UpdateModulePolicyHandler } from 'src/authorization/policy-handler/module/update-module-policy.handler';
import { CheckPolicies } from 'src/shared/decorators/check-policies.decorator';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { PoliciesGuard } from 'src/shared/guards/policies.guard';
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
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(CreateModulePolicyHandler)
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
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(ReadModulePolicyHandler)
  findOne(@Param('id') id: string): Promise<Module | object> {
    return this.moduleService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(UpdateModulePolicyHandler)
  update(
    @Param('id') id: string,
    @Body() updateModuleDto: UpdateModuleDto,
  ): Promise<Module> {
    return this.moduleService.update(+id, updateModuleDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(DeleteModulePolicyHandler)
  delete(@Param('id') id: string): Promise<void> {
    return this.moduleService.delete(+id);
  }
}
