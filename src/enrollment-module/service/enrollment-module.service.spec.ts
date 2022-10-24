import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentModuleService } from './enrollment-module.service';

describe('EnrollmentModuleService', () => {
  let service: EnrollmentModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnrollmentModuleService],
    }).compile();

    service = module.get<EnrollmentModuleService>(EnrollmentModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
