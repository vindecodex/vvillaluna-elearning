import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ReadEnrollmentPolicyHandler } from '../../../authorization/policy-handler/enrollment/read-enrollment-policy.handler';
import { EnrollmentService } from '../../../enrollment/service/enrollment.service';

export const ReadEnrollmentPolicyProvider: Provider = {
  provide: ReadEnrollmentPolicyHandler,
  inject: [EnrollmentService, REQUEST],
  useFactory: async (
    enrollmentService: EnrollmentService,
    request: Request,
  ) => {
    const { id } = request.params;
    const enrollment = await enrollmentService.findOne(+id);
    return new ReadEnrollmentPolicyHandler(enrollment);
  },
};
