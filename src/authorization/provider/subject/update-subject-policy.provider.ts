import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UpdateSubjectPolicyHandler } from '../../../authorization/policy-handler/subject/update-subject-policy.handler';
import { SubjectService } from '../../../subject/service/subject.service';

export const UpdateSubjectPolicyProvider: Provider = {
  provide: UpdateSubjectPolicyHandler,
  inject: [SubjectService, REQUEST],
  useFactory: async (subjectService: SubjectService, request: Request) => {
    const { id } = request.params;
    const subject = await subjectService.findOne(+id);
    return new UpdateSubjectPolicyHandler(subject);
  },
};
