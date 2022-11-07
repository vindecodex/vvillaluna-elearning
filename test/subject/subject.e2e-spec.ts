import { Test, TestingModule } from '@nestjs/testing';
import {
  ClassSerializerInterceptor,
  HttpStatus,
  INestApplication,
} from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../../src/auth/service/auth.service';
import { Role } from '../../src/authorization/enums/role.enum';
import { UserCredentialsDto } from '../../src/auth/dto/user-credentials.dto';
import { User } from '../../src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as request from 'supertest';
import { MailService } from '../../src/mail/mail.service';

let app: INestApplication;

const createUser = async (role: Role, email?: string): Promise<User> => {
  const payload = {
    email: `${email ? email : role}@mail.com`,
    password: 'test',
    verifyPassword: 'test',
    role: role,
    firstName: role,
    lastName: role,
  };
  const user = await app
    .get(AuthService)
    .createUser(payload as UserCredentialsDto);
  return user;
};

const getUserToken = (user: User): string =>
  app.get(JwtService).sign({ ...user });

// Mock Service
const mailService = {
  sendVerification: () => true,
  sendResetPasswordLink: () => true,
  sendAccountNotFound: () => true,
};

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
      .useValue(mailService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );

    await app.init();

    admin = getUserToken(await createUser(Role.ADMIN));
    instructorA = getUserToken(
      await createUser(Role.INSTRUCTOR, 'instructorA'),
    );
    instructorB = getUserToken(
      await createUser(Role.INSTRUCTOR, 'instructorB'),
    );
    student = getUserToken(await createUser(Role.STUDENT));
  });

  afterAll(async () => {
    await app.close();
  });

  it('[POST /subjects] - Should allow subject creation for INSTRUCTOR', async () => {
    return request(app.getHttpServer())
      .post('/subjects')
      .set('Authorization', `Bearer ${instructorA}`)
      .send({ title: 'Programming Language' })
      .expect(HttpStatus.CREATED);
  });

  it('[POST /subjects] - Should return (403) for subject creation by STUDENT', async () => {
    return request(app.getHttpServer())
      .post('/subjects')
      .set('Authorization', `Bearer ${student}`)
      .send({ title: 'Programming Language' })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[POST /subjects] - Should return (403) for subject creation by ADMIN', async () => {
    return request(app.getHttpServer())
      .post('/subjects')
      .set('Authorization', `Bearer ${admin}`)
      .send({ title: 'Programming Language' })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[GET /subjects] - Should see list of subjects', async () => {
    return request(app.getHttpServer())
      .get('/subjects')
      .set('Authorization', `Bearer ${student}`)
      .expect(HttpStatus.OK);
  });

  it('GET /subjects/{id} - Subject OWNER should be able to see unpublished', async () => {
    return request(app.getHttpServer())
      .get('/subjects/1')
      .set('Authorization', `Bearer ${instructorA}`)
      .expect(HttpStatus.OK);
  });

  it('GET /subjects/{id} - Subject none OWNER should not be able to see unpublished', async () => {
    return request(app.getHttpServer())
      .get('/subjects/1')
      .set('Authorization', `Bearer ${instructorB}`)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('GET /subjects/{id} - Subject none OWNER should not be able to see unpublished EXCEPT for ADMIN', async () => {
    return request(app.getHttpServer())
      .get('/subjects/1')
      .set('Authorization', `Bearer ${admin}`)
      .expect(HttpStatus.OK);
  });

  it('[PATCH /subjects/{id} - Should able to update its own subject', async () => {
    return request(app.getHttpServer())
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
    return request(app.getHttpServer())
      .patch('/subjects/1')
      .set('Authorization', `Bearer ${instructorB}`)
      .send({ title: 'Updated' })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[PATCH /subjects/{id} - Should return (403) when STUDENT update a subject', async () => {
    return request(app.getHttpServer())
      .patch('/subjects/1')
      .set('Authorization', `Bearer ${student}`)
      .send({ title: 'Updated' })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[PATCH /subjects/{id} - Should return (403) when ADMIN update a subject', async () => {
    return request(app.getHttpServer())
      .patch('/subjects/1')
      .set('Authorization', `Bearer ${admin}`)
      .send({ title: 'Updated' })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[DELETE /subjects/{id} - Subject OWNER should be able to delete', async () => {
    return request(app.getHttpServer())
      .del('/subjects/1')
      .set('Authorization', `Bearer ${instructorA}`)
      .expect(HttpStatus.OK);
  });

  it('[DELETE /subjects/{id} - Subject none OWNER should not be able to delete', async () => {
    // Since first subject was deleted need to add 1 more to avoid 404
    await request(app.getHttpServer())
      .post('/subjects')
      .set('Authorization', `Bearer ${instructorA}`)
      .send({ title: 'test' });

    return request(app.getHttpServer())
      .del('/subjects/2')
      .set('Authorization', `Bearer ${instructorB}`)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[DELETE /subjects/{id} - Subject none OWNER should not be able to delete EXCEPT for ADMIN', async () => {
    return request(app.getHttpServer())
      .del('/subjects/2')
      .set('Authorization', `Bearer ${admin}`)
      .expect(HttpStatus.OK);
  });
});
