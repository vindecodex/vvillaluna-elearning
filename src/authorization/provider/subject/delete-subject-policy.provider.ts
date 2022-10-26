import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { DeleteSubjectPolicyHandler } from '../../../authorization/policy-handler/subject/delete-subject-policy.handler';
import { SubjectService } from '../../../subject/service/subject.service';

export const DeleteSubjectPolicyProvider: Provider = {
  provide: DeleteSubjectPolicyHandler,
  inject: [SubjectService, REQUEST],
  useFactory: async (subjectService: SubjectService, request: Request) => {
    const { id } = request.params;
    const subject = await subjectService.findOne(+id);
    return new DeleteSubjectPolicyHandler(subject);
  },
};
