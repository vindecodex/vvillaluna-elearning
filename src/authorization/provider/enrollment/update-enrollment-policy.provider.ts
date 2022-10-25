import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UpdateEnrollmentPolicyHandler } from 'src/authorization/policy-handler/enrollment/update-enrollment-policy.handler';
import { EnrollmentService } from 'src/enrollment/service/enrollment.service';

export const UpdateEnrollmentPolicyProvider: Provider = {
  provide: UpdateEnrollmentPolicyHandler,
  inject: [EnrollmentService, REQUEST],
  useFactory: async (
    enrollmentService: EnrollmentService,
    request: Request,
  ) => {
    const { id } = request.params;
    const enrollment = await enrollmentService.findOne(+id);
    return new UpdateEnrollmentPolicyHandler(enrollment);
  },
};
