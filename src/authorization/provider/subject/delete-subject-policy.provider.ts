import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { DeleteSubjectPolicyHandler } from 'src/authorization/policy-handler/subject/delete-subject-policy.handler';
import { Subject } from 'src/subject/entities/subject.entity';
import { SubjectService } from 'src/subject/service/subject.service';

export const DeleteSubjectPolicyProvider: Provider = {
  provide: DeleteSubjectPolicyHandler,
  inject: [SubjectService, REQUEST],
  useFactory: async (subjectService: SubjectService, request: Request) => {
    const { id } = request.params;
    const subject = await subjectService.findOne(+id);
    return new DeleteSubjectPolicyHandler(subject as Subject);
  },
};
