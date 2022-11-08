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
    await request(server)
      .post('/modules')
      .set('Authorization', `Bearer ${instructorA}`)
      .send({
        title: 'Introduction to Javascript',
        duration: 3600,
        courseId: 1,
      });
  });

  afterAll(async () => {
    await app.close();
  });

  it('[POST /contents] - Should allow to add contents to its OWNED module for INSTRUCTOR', async () => {
    return request(server)
      .post('/contents')
      .set('Authorization', `Bearer ${instructorA}`)
      .send({
        moduleId: 1,
        content: 'Javascript mastery content',
        type: 'text',
      })
      .expect(HttpStatus.CREATED);
  });

  it('[POST /contents] - Should return (403) if adding contents to a module not OWNED by INSTRUCTOR', async () => {
    return request(server)
      .post('/contents')
      .set('Authorization', `Bearer ${instructorB}`)
      .send({
        moduleId: 1,
        content: 'http:repository',
        type: 'link',
      })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[POST /contents] - Should return (403) when STUDENT attempts to create content', async () => {
    return request(server)
      .post('/contents')
      .set('Authorization', `Bearer ${student}`)
      .send({
        moduleId: 1,
        content: 'http:repository',
        type: 'link',
      })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[POST /contents] - Should return (403) when ADMIN attempts to create content', async () => {
    return request(server)
      .post('/contents')
      .set('Authorization', `Bearer ${admin}`)
      .send({
        moduleId: 1,
        content: 'http:repository',
        type: 'link',
      })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[GET /contents] - Should see list of Contents', async () => {
    return request(server)
      .get('/contents')
      .set('Authorization', `Bearer ${student}`)
      .expect(HttpStatus.OK);
  });

  it('[GET /contents/{id}] - Content OWNER should be able to see unpublished', async () => {
    return request(server)
      .get('/contents/1')
      .set('Authorization', `Bearer ${instructorA}`)
      .expect(HttpStatus.OK);
  });

  it('[GET /contents/{id}] - Should return (403) none ONWER should not able to see unpublished', async () => {
    return request(server)
      .get('/contents/1')
      .set('Authorization', `Bearer ${student}`)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[GET /contents/{id}] - None OWNER should not able to see unpublished EXCEPT for ADMIN', async () => {
    return request(server)
      .get('/contents/1')
      .set('Authorization', `Bearer ${admin}`)
      .expect(HttpStatus.OK);
  });

  it('[PATCH /contents/{id}] - OWNER should able to update content', async () => {
    return request(server)
      .patch('/contents/1')
      .set('Authorization', `Bearer ${instructorA}`)
      .send({ isPublished: true })
      .expect(HttpStatus.OK);
  });

  it('[PATCH /contents/{id}] - Should return (403) when STUDENT attempts to update content', async () => {
    return request(server)
      .patch('/contents/1')
      .set('Authorization', `Bearer ${student}`)
      .send({ isPublished: true })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[PATCH /contents/{id}] - Should return (403) when ADMIN attempts to update content', async () => {
    return request(server)
      .patch('/contents/1')
      .set('Authorization', `Bearer ${admin}`)
      .send({ isPublished: true })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('DELETE /contents/{id}] - OWNER should be able to delete content', async () => {
    return request(server)
      .del('/contents/1')
      .set('Authorization', `Bearer ${instructorA}`)
      .send({ isPublished: true })
      .expect(HttpStatus.OK);
  });

  it('DELETE /contents/{id}] - Should return (403) when none OWNER  attempts to delete content', async () => {
    await request(server)
      .post('/contents')
      .set('Authorization', `Bearer ${instructorA}`)
      .send({
        moduleId: 1,
        content: 'Javascript mastery content',
        type: 'text',
      });

    return request(server)
      .del('/contents/2')
      .set('Authorization', `Bearer ${instructorB}`)
      .send({ isPublished: true })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('DELETE /contents/{id}] - ADMIN should be able to delete any content', async () => {
    return request(server)
      .del('/contents/2')
      .set('Authorization', `Bearer ${admin}`)
      .send({ isPublished: true })
      .expect(HttpStatus.OK);
  });
});
