import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UpdateContentPolicyHandler } from '../../../authorization/policy-handler/content/update-content-policy.handler';
import { ContentService } from '../../../content/service/content.service';

export const UpdateContentPolicyProvider: Provider = {
  provide: UpdateContentPolicyHandler,
  inject: [ContentService, REQUEST],
  useFactory: async (contentService: ContentService, request: Request) => {
    const { id } = request.params;
    const content = await contentService.findOne(+id);
    return new UpdateContentPolicyHandler(content);
  },
};
