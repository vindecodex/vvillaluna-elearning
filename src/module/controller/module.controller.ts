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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateModulePolicyHandler } from '../../authorization/policy-handler/module/create-module-policy.handler';
import { DeleteModulePolicyHandler } from '../../authorization/policy-handler/module/delete-module-policy.handler';
import { ReadModulePolicyHandler } from '../../authorization/policy-handler/module/read-module-policy.handler';
import { UpdateModulePolicyHandler } from '../../authorization/policy-handler/module/update-module-policy.handler';
import { CheckPolicies } from '../../shared/decorators/check-policies.decorator';
import { GetUser } from '../../shared/decorators/get-user.decorator';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PoliciesGuard } from '../../shared/guards/policies.guard';
import { ResponseList } from '../../shared/interfaces/response-list.interface';
import { User } from '../../user/entities/user.entity';
import { CreateModuleDto } from '../dto/create-module.dto';
import { ModuleQueryDto } from '../dto/module-query.dto';
import { UpdateModuleDto } from '../dto/update-module.dto';
import { Module } from '../entities/module.entity';
import { ModuleService } from '../service/module.service';

@ApiBearerAuth()
@ApiTags('Module')
@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(CreateModulePolicyHandler)
  create(@Body() dto: CreateModuleDto, @GetUser() user: User): Promise<Module> {
    return this.moduleService.create(dto, user);
  }

  @Get()
  findAll(@Query() dto: ModuleQueryDto): Promise<ResponseList<Module>> {
    return this.moduleService.findAll(dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(ReadModulePolicyHandler)
  findOne(@Param('id') id: string): Promise<Module> {
    return this.moduleService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(UpdateModulePolicyHandler)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateModuleDto,
  ): Promise<Module> {
    return this.moduleService.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(DeleteModulePolicyHandler)
  delete(@Param('id') id: string): Promise<void> {
    return this.moduleService.delete(+id);
  }
}
