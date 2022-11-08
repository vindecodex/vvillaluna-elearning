import { Test, TestingModule } from '@nestjs/testing';
import {
  ClassSerializerInterceptor,
  HttpStatus,
  INestApplication,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Reflector } from '@nestjs/core';
import { MailService } from '../../src/mail/mail.service';
import { testHelper, testServiceTool } from '../test.helper';

let app: INestApplication;
let server: any;

describe('Coures Module (e2e)', () => {
  let admin: string;
  let instructorA: string;
  let instructorB: string;
  let studentA: string;
  let studentB: string;
  let extractUser: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MailService)
      .useValue(testHelper.mocks.mailService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );

    await app.init();
    server = app.getHttpServer();

    const actorsToken = await testHelper.actors(app);
    const { getUserByToken } = testServiceTool(app);

    admin = actorsToken.admin;
    instructorA = actorsToken.instructorA;
    instructorB = actorsToken.instructorB;
    studentA = actorsToken.studentA;
    studentB = actorsToken.studentB;
    extractUser = getUserByToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('[GET /users] - ADMIN should able to see all users', async () => {
    return request(server)
      .get('/users')
      .set('Authorization', `Bearer ${admin}`)
      .expect(HttpStatus.OK);
  });

  it('[GET /users/{id}] - ADMIN should able to see STUDENT', async () => {
    const student = extractUser(studentA);
    return request(server)
      .get(`/users/${student.id}`)
      .set('Authorization', `Bearer ${admin}`)
      .expect(HttpStatus.OK);
  });

  it('[GET /users] - ADMIN should able to see INSTRUCTOR', async () => {
    const instructor = extractUser(instructorA);
    return request(server)
      .get(`/users/${instructor.id}`)
      .set('Authorization', `Bearer ${admin}`)
      .expect(HttpStatus.OK);
  });

  it('[GET /users/{id}] - INSTRUCTOR can view any INSTRUCTOR', async () => {
    const instructor = extractUser(instructorA);
    return request(server)
      .get(`/users/${instructor.id}`)
      .set('Authorization', `Bearer ${instructorB}`)
      .expect(HttpStatus.OK);
  });

  it('[GET /users/{id}] - INSTRUCTOR can view any STUDENT', async () => {
    const student = extractUser(studentA);
    return request(server)
      .get(`/users/${student.id}`)
      .set('Authorization', `Bearer ${instructorA}`)
      .expect(HttpStatus.OK);
  });

  it('[GET /users/{id}] - INSTRUCTOR should not able to view any ADMIN', async () => {
    const adminObject = extractUser(admin);
    return request(server)
      .get(`/users/${adminObject.id}`)
      .set('Authorization', `Bearer ${instructorA}`)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[GET /users/{id}] - STUDENT should able to view any INSTRUCTOR', async () => {
    const instructor = extractUser(instructorA);
    return request(server)
      .get(`/users/${instructor.id}`)
      .set('Authorization', `Bearer ${studentA}`)
      .expect(HttpStatus.OK);
  });

  it('[GET /users/{id}] - STUDENT should able to view its OWN', async () => {
    const student = extractUser(studentA);
    return request(server)
      .get(`/users/${student.id}`)
      .set('Authorization', `Bearer ${studentA}`)
      .expect(HttpStatus.OK);
  });

  it('[GET /users/{id}] - STUDENT should not able to view any STUDENT', async () => {
    const student = extractUser(studentA);
    return request(server)
      .get(`/users/${student.id}`)
      .set('Authorization', `Bearer ${studentB}`)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[GET /users/{id}] - STUDENT should not able to view any ADMIN', async () => {
    const adminObject = extractUser(admin);
    return request(server)
      .get(`/users/${adminObject.id}`)
      .set('Authorization', `Bearer ${studentA}`)
      .expect(HttpStatus.FORBIDDEN);
  });
});
