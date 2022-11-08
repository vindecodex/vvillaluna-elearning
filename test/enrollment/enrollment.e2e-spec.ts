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
import { testHelper } from '../test.helper';
import { CourseService } from '../../src/course/service/course.service';

let app: INestApplication;
let server: any;

describe('Coures Module (e2e)', () => {
  let admin: string;
  let instructorA: string;
  let instructorB: string;
  let studentA: string;
  let studentB: string;

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
    admin = actorsToken.admin;
    instructorA = actorsToken.instructorA;
    instructorB = actorsToken.instructorB;
    studentA = actorsToken.studentA;
    studentB = actorsToken.studentB;

    await request(server)
      .post('/subjects')
      .set('Authorization', `Bearer ${instructorA}`)
      .send({ title: 'Programming Language' });

    await request(server)
      .post('/courses')
      .set('Authorization', `Bearer ${instructorA}`)
      .send({ title: 'Javascript', subjectId: 1 });
    await request(server)
      .post('/modules')
      .set('Authorization', `Bearer ${instructorA}`)
      .send({ title: 'Introduction to JS', duration: 3600, courseId: 1 });

    await request(server)
      .post('/courses')
      .set('Authorization', `Bearer ${instructorB}`)
      .send({ title: 'Go (Golang)', subjectId: 1 });

    await app.get(CourseService).update(1, { isPublished: true });
  });

  afterAll(async () => {
    await app.close();
  });

  it('[POST /enrollments] - STUDENT should be able to enroll a published course', async () => {
    return request(server)
      .post('/enrollments')
      .set('Authorization', `Bearer ${studentA}`)
      .send({ courseId: 1 })
      .expect(HttpStatus.CREATED);
  });

  it('[POST /enrollments] - ADMIN should not be able to enroll a course', async () => {
    return request(server)
      .post('/enrollments')
      .set('Authorization', `Bearer ${admin}`)
      .send({ courseId: 1 })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[POST /enrollments] - INSTRUCTOR should not be able to enroll a course', async () => {
    return request(server)
      .post('/enrollments')
      .set('Authorization', `Bearer ${instructorA}`)
      .send({ courseId: 1 })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[POST /enrollments] - STUDENT should not be able to enroll to a course that is already enrolled', async () => {
    return request(server)
      .post('/enrollments')
      .set('Authorization', `Bearer ${studentA}`)
      .send({ courseId: 1 })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('[POST /enrollments] - STUDENT should not be able to enroll to unpublished course', async () => {
    return request(server)
      .post('/enrollments')
      .set('Authorization', `Bearer ${studentB}`)
      .send({ courseId: 2 })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[GET /enrollments/{id}] - STUDENT should able to see its OWN enrollment', async () => {
    return request(server)
      .get('/enrollments/1')
      .set('Authorization', `Bearer ${studentA}`)
      .expect(HttpStatus.OK);
  });

  it('[GET /enrollments/{id}] - STUDENT should not able to see others enrollment', async () => {
    return request(server)
      .get('/enrollments/1')
      .set('Authorization', `Bearer ${studentB}`)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[PATCH /enrollment/{id}] - STUDENT should able to update its own enrollment', async () => {
    return request(server)
      .patch('/enrollments/1')
      .set('Authorization', `Bearer ${studentA}`)
      .send({ moduleId: 1, isCompleted: true })
      .expect(HttpStatus.OK);
  });

  it('[PATCH /enrollment/{id}] - STUDENT should not able to update others enrollment', async () => {
    return request(server)
      .patch('/enrollments/1')
      .set('Authorization', `Bearer ${studentB}`)
      .send({ moduleId: 1, isCompleted: false })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[DELETE /enrollment/{id}] - STUDENT should able to delete its own enrollment', async () => {
    return request(server)
      .del('/enrollments/1')
      .set('Authorization', `Bearer ${studentA}`)
      .expect(HttpStatus.OK);
  });

  it('[DELETE /enrollment/{id}] - STUDENT should not able to delete others enrollment', async () => {
    await request(server)
      .post('/enrollments')
      .set('Authorization', `Bearer ${studentB}`)
      .send({ courseId: 1 });

    return request(server)
      .del('/enrollments/3')
      .set('Authorization', `Bearer ${studentA}`)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[DELETE /enrollment/{id}] - ADMIN should able to delete any enrollment', async () => {
    return request(server)
      .del('/enrollments/3')
      .set('Authorization', `Bearer ${admin}`)
      .expect(HttpStatus.OK);
  });
});
