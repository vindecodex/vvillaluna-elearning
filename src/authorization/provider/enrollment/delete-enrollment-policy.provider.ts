import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { DeleteEnrollmentPolicyHandler } from 'src/authorization/policy-handler/enrollment/delete-enrollment-policy.handler';
import { EnrollmentService } from 'src/enrollment/service/enrollment.service';

export const DeleteEnrollmentPolicyProvider: Provider = {
  provide: DeleteEnrollmentPolicyHandler,
  inject: [EnrollmentService, REQUEST],
  useFactory: async (
    enrollmentService: EnrollmentService,
    request: Request,
  ) => {
    const { id } = request.params;
    const enrollment = await enrollmentService.findOne(+id);
    return new DeleteEnrollmentPolicyHandler(enrollment);
  },
};
