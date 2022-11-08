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

let app: INestApplication;
let server: any;

describe('Coures Module (e2e)', () => {
  let admin: string;
  let instructorA: string;
  let instructorB: string;
  let student: string;

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
    student = actorsToken.studentA;

    await request(server)
      .post('/subjects')
      .set('Authorization', `Bearer ${instructorA}`)
      .send({ title: 'Programming Language' });
    await request(server)
      .post('/courses')
      .set('Authorization', `Bearer ${instructorA}`)
      .send({ title: 'Javascript', subjectId: 1 });
  });

  afterAll(async () => {
    await app.close();
  });

  it('[POST /modules] - Should allow to add module to its OWNED course for INSTRUCTOR', async () => {
    return request(server)
      .post('/modules')
      .set('Authorization', `Bearer ${instructorA}`)
      .send({
        title: 'Introduction to Javascript',
        duration: 3600,
        courseId: 1,
      })
      .expect(HttpStatus.CREATED);
  });

  it('[POST /modules] - Should return (403) if adding module to a course not OWNED by INSTRUCTOR', async () => {
    return request(server)
      .post('/modules')
      .set('Authorization', `Bearer ${instructorB}`)
      .send({
        title: 'Javascript Theory',
        duration: 3600,
        courseId: 1,
      })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[POST /modules] - Should return (403) when STUDENT attempts to create module', async () => {
    return request(server)
      .post('/modules')
      .set('Authorization', `Bearer ${student}`)
      .send({
        title: 'Javascript Theory',
        duration: 3600,
        courseId: 1,
      })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[POST /modules] - Should return (403) when ADMIN attempts to create module', async () => {
    return request(server)
      .post('/modules')
      .set('Authorization', `Bearer ${admin}`)
      .send({
        title: 'Javascript Theory',
        duration: 3600,
        courseId: 1,
      })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[GET /modules] - Should see list of modules', async () => {
    return request(server)
      .get('/modules')
      .set('Authorization', `Bearer ${student}`)
      .expect(HttpStatus.OK);
  });

  it('[GET /modules/{id}] - Module OWNER should be able to see unpublished', async () => {
    return request(server)
      .get('/modules/1')
      .set('Authorization', `Bearer ${instructorA}`)
      .expect(HttpStatus.OK);
  });

  it('[GET /modules/{id}] - Should return (403) none OWNER should not be able to see unpublished', async () => {
    return request(server)
      .get('/modules/1')
      .set('Authorization', `Bearer ${instructorB}`)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[GET /modules/{id}] - None OWNER should not be able to see unpublished EXCEPT for ADMIN', async () => {
    return request(server)
      .get('/modules/1')
      .set('Authorization', `Bearer ${admin}`)
      .expect(HttpStatus.OK);
  });

  it('[PATCH /modules/{id}] - OWNER should be able to update module', async () => {
    return request(server)
      .patch('/modules/1')
      .set('Authorization', `Bearer ${instructorA}`)
      .send({ isPublished: true })
      .expect(HttpStatus.OK);
  });

  it('[PATCH /modules/{id}] - Should return (403) when STUDENT attempts to update module', async () => {
    return request(server)
      .patch('/modules/1')
      .set('Authorization', `Bearer ${student}`)
      .send({ isPublished: true })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[PATCH /modules/{id}] - Should return (403) when ADMIN attempts to update module', async () => {
    return request(server)
      .patch('/modules/1')
      .set('Authorization', `Bearer ${admin}`)
      .send({ isPublished: true })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[DELETE /modules/{id}] - OWNER should be able to delete module', async () => {
    return request(server)
      .del('/modules/1')
      .set('Authorization', `Bearer ${instructorA}`)
      .expect(HttpStatus.OK);
  });

  it('[DELETE /modules/{id}] - Should return (403) when none OWNER attempts to delete module', async () => {
    await request(server)
      .post('/modules')
      .set('Authorization', `Bearer ${instructorA}`)
      .send({
        title: 'Introduction to Javascript',
        duration: 3600,
        courseId: 1,
      });

    return request(server)
      .del('/modules/2')
      .set('Authorization', `Bearer ${instructorB}`)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[DELETE /modules/{id}] - ADMIN should be able to delete any module', async () => {
    return request(server)
      .del('/modules/2')
      .set('Authorization', `Bearer ${admin}`)
      .expect(HttpStatus.OK);
  });
});
