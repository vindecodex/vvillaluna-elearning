import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { DeleteContentPolicyHandler } from '../../../authorization/policy-handler/content/delete-content-policy.handler';
import { ContentService } from '../../../content/service/content.service';

export const DeleteContentPolicyProvider: Provider = {
  provide: DeleteContentPolicyHandler,
  inject: [ContentService, REQUEST],
  useFactory: async (contentService: ContentService, request: Request) => {
    const { id } = request.params;
    const content = await contentService.findOne(+id);
    return new DeleteContentPolicyHandler(content);
  },
};
