import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ReadContentPolicyHandler } from '../../../authorization/policy-handler/content/read-content-policy.handler';
import { ContentService } from '../../../content/service/content.service';

export const ReadContentPolicyProvider: Provider = {
  provide: ReadContentPolicyHandler,
  inject: [ContentService, REQUEST],
  useFactory: async (contentService: ContentService, request: Request) => {
    const { id } = request.params;
    const content = await contentService.findOne(+id);
    return new ReadContentPolicyHandler(content);
  },
};
