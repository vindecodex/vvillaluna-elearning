import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CreateContentPolicyHandler } from 'src/authorization/policy-handler/content/create-content-policy.handler';
import { DeleteContentPolicyHandler } from 'src/authorization/policy-handler/content/delete-content-policy.handler';
import { ReadContentPolicyHandler } from 'src/authorization/policy-handler/content/read-content-policy.handler';
import { UpdateContentPolicyHandler } from 'src/authorization/policy-handler/content/update-content-policy.handler';
import { CheckPolicies } from 'src/shared/decorators/check-policies.decorator';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { PoliciesGuard } from 'src/shared/guards/policies.guard';
import { ResponseList } from 'src/shared/interfaces/response-list.interface';
import { User } from 'src/user/entities/user.entity';
import { ContentQueryDto } from '../dto/content-query.dto';
import { CreateContentDto } from '../dto/create-content.dto';
import { UpdateContentDto } from '../dto/update-content.dto';
import { Content } from '../entities/content.entity';
import { ContentService } from '../service/content.service';

@Controller('contents')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(CreateContentPolicyHandler)
  create(
    @Body() dto: CreateContentDto,
    @GetUser() user: User,
  ): Promise<Content> {
    return this.contentService.create(dto, user);
  }

  @Get()
  findAll(@Query() dto: ContentQueryDto): Promise<ResponseList<Content>> {
    return this.contentService.findAll(dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(ReadContentPolicyHandler)
  findOne(@Param('id') id: string): Promise<Content> {
    return this.contentService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(UpdateContentPolicyHandler)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateContentDto,
  ): Promise<Content> {
    return this.contentService.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(DeleteContentPolicyHandler)
  delete(@Param('id') id: string): Promise<void> {
    return this.contentService.delete(+id);
  }
}
