import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ReadSubjectPolicyHandler } from 'src/authorization/policy-handler/subject/read-subject-policy.handler';
import { SubjectService } from 'src/subject/service/subject.service';

export const ReadSubjectPolicyProvider: Provider = {
  provide: ReadSubjectPolicyHandler,
  inject: [SubjectService, REQUEST],
  useFactory: async (subjectService: SubjectService, request: Request) => {
    const { id } = request.params;
    const subject = await subjectService.findOne(+id);
    return new ReadSubjectPolicyHandler(subject);
  },
};
