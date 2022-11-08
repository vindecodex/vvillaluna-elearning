import { Test, TestingModule } from '@nestjs/testing';
import {
  ClassSerializerInterceptor,
  HttpStatus,
  INestApplication,
} from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { Reflector } from '@nestjs/core';
import * as request from 'supertest';
import { MailService } from '../../src/mail/mail.service';
import { testHelper } from '../test.helper';

let app: INestApplication;
let server: any;

describe('Subject Module (e2e)', () => {
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
  });

  afterAll(async () => {
    await app.close();
  });

  it('[POST /subjects] - Should allow subject creation for INSTRUCTOR', async () => {
    return request(server)
      .post('/subjects')
      .set('Authorization', `Bearer ${instructorA}`)
      .send({ title: 'Programming Language' })
      .expect(HttpStatus.CREATED);
  });

  it('[POST /subjects] - Should return (403) for subject creation by STUDENT', async () => {
    return request(server)
      .post('/subjects')
      .set('Authorization', `Bearer ${student}`)
      .send({ title: 'Programming Language' })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[POST /subjects] - Should return (403) for subject creation by ADMIN', async () => {
    return request(server)
      .post('/subjects')
      .set('Authorization', `Bearer ${admin}`)
      .send({ title: 'Programming Language' })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[GET /subjects] - Should see list of subjects', async () => {
    return request(server)
      .get('/subjects')
      .set('Authorization', `Bearer ${student}`)
      .expect(HttpStatus.OK);
  });

  it('GET /subjects/{id} - Subject OWNER should be able to see unpublished', async () => {
    return request(server)
      .get('/subjects/1')
      .set('Authorization', `Bearer ${instructorA}`)
      .expect(HttpStatus.OK);
  });

  it('GET /subjects/{id} - Should return (403) none OWNER should not be able to see unpublished', async () => {
    return request(server)
      .get('/subjects/1')
      .set('Authorization', `Bearer ${instructorB}`)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('GET /subjects/{id} - Subject none OWNER should not be able to see unpublished EXCEPT for ADMIN', async () => {
    return request(server)
      .get('/subjects/1')
      .set('Authorization', `Bearer ${admin}`)
      .expect(HttpStatus.OK);
  });

  it('[PATCH /subjects/{id} - Should able to update its own subject', async () => {
    return request(server)
      .patch('/subjects/1')
      .set('Authorization', `Bearer ${instructorA}`)
      .send({ title: 'Updated' })
      .expect(HttpStatus.OK)
      .then((res) => {
        const { title } = res.body;
        expect(title).toEqual('Updated');
      });
  });

  it('[PATCH /subjects/{id} - Should return (403) when updating not owned subject', async () => {
    return request(server)
      .patch('/subjects/1')
      .set('Authorization', `Bearer ${instructorB}`)
      .send({ title: 'Updated' })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[PATCH /subjects/{id} - Should return (403) when STUDENT update a subject', async () => {
    return request(server)
      .patch('/subjects/1')
      .set('Authorization', `Bearer ${student}`)
      .send({ title: 'Updated' })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[PATCH /subjects/{id} - Should return (403) when ADMIN update a subject', async () => {
    return request(server)
      .patch('/subjects/1')
      .set('Authorization', `Bearer ${admin}`)
      .send({ title: 'Updated' })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[DELETE /subjects/{id} - Subject OWNER should be able to delete', async () => {
    return request(server)
      .del('/subjects/1')
      .set('Authorization', `Bearer ${instructorA}`)
      .expect(HttpStatus.OK);
  });

  it('[DELETE /subjects/{id} - Subject none OWNER should not be able to delete', async () => {
    // Since first subject was deleted need to add 1 more to avoid 404
    await request(server)
      .post('/subjects')
      .set('Authorization', `Bearer ${instructorA}`)
      .send({ title: 'test' });

    return request(server)
      .del('/subjects/2')
      .set('Authorization', `Bearer ${instructorB}`)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[DELETE /subjects/{id} - Subject none OWNER should not be able to delete EXCEPT for ADMIN', async () => {
    return request(server)
      .del('/subjects/2')
      .set('Authorization', `Bearer ${admin}`)
      .expect(HttpStatus.OK);
  });
});
