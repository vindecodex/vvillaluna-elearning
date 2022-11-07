import { Test, TestingModule } from '@nestjs/testing';
import {
  ClassSerializerInterceptor,
  HttpStatus,
  INestApplication,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Reflector } from '@nestjs/core';
import { Role } from '../../src/authorization/enums/role.enum';
import { User } from '../../src/user/entities/user.entity';
import { AuthService } from '../../src/auth/service/auth.service';
import { UserCredentialsDto } from '../../src/auth/dto/user-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../../src/mail/mail.service';
import { async } from 'rxjs';

let app: INestApplication;
let server: any;

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

describe('Course Module (e2e)', () => {
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
    server = app.getHttpServer();

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

  it('[POST /courses] - Should allow course creation by INSTRUCTOR', async () => {
    await request(server)
      .post('/subjects')
      .set('Authorization', `Bearer ${instructorA}`)
      .send({ title: 'Programming Language' });

    return request(server)
      .post('/courses')
      .set('Authorization', `Bearer ${instructorA}`)
      .send({ title: 'Javascript', subjectId: 1 })
      .expect(HttpStatus.CREATED);
  });

  it('[POST /courses] - Should return (403) when STUDENT attempts to create course', async () => {
    return request(server)
      .post('/courses')
      .set('Authorization', `Bearer ${student}`)
      .send({ title: 'Go (Golang)', subjectId: 1 })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[POST /courses] - Should return (403) when ADMIN attempts to create course', async () => {
    return request(server)
      .post('/courses')
      .set('Authorization', `Bearer ${admin}`)
      .send({ title: 'Go (Golang)', subjectId: 1 })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[GET /courses] - Should see list of courses', async () => {
    return request(server)
      .get('/courses')
      .set('Authorization', `Bearer ${student}`)
      .expect(HttpStatus.OK);
  });

  it('[GET /courses/{id}] - Course OWNER should be able to see unpublished', async () => {
    return request(server)
      .get('/courses/1')
      .set('Authorization', `Bearer ${instructorA}`)
      .expect(HttpStatus.OK);
  });

  it('[GET /courses/{id}] - Should return (403) none OWNER should not be able to see unpublished', async () => {
    return request(server)
      .get('/courses/1')
      .set('Authorization', `Bearer ${instructorB}`)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[GET /courses/{id}] - Course none OWNER should not be able to see unpublished EXCEPT for ADMIN', async () => {
    return request(server)
      .get('/courses/1')
      .set('Authorization', `Bearer ${admin}`)
      .expect(HttpStatus.OK);
  });

  it('[PATCH /courses/{id}] - OWNER should be able to update course', async () => {
    return request(server)
      .patch('/courses/1')
      .set('Authorization', `Bearer ${instructorA}`)
      .send({ title: 'Golang' })
      .expect(HttpStatus.OK)
      .then((res) => {
        const { title } = res.body;
        expect(title).toEqual('Golang');
      });
  });

  it('[PATCH /courses/{id}] - Should return (403) when updating none OWNER course', async () => {
    return request(server)
      .patch('/courses/1')
      .set('Authorization', `Bearer ${instructorB}`)
      .send({ title: 'Golang' })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[PATCH /courses/{id}] - Should return (403) when STUDENT tries to update a course', async () => {
    return request(server)
      .patch('/courses/1')
      .set('Authorization', `Bearer ${student}`)
      .send({ title: 'Golang' })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[PATCH /courses/{id}] - Should return (403) when ADMIN tries to update a course', async () => {
    return request(server)
      .patch('/courses/1')
      .set('Authorization', `Bearer ${admin}`)
      .send({ title: 'Golang' })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[DELETE /courses/{id}] - Course OWNER should be able to delete', async () => {
    return request(server)
      .del('/courses/1')
      .set('Authorization', `Bearer ${instructorA}`)
      .expect(HttpStatus.OK);
  });

  it('[DELETE /courses/{id}] - Course none OWNER should not be able to delete', async () => {
    // create a new course since the other course was deleted already
    await request(server)
      .post('/courses')
      .set('Authorization', `Bearer ${instructorA}`)
      .send({ title: 'PHP', subjectId: 1 });

    return request(server)
      .del('/courses/2')
      .set('Authorization', `Bearer ${instructorB}`)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('[DELETE /courses/{id}] - Course none OWNER should not be able to delete EXCEPT for ADMIN', async () => {
    return request(server)
      .del('/courses/2')
      .set('Authorization', `Bearer ${admin}`)
      .expect(HttpStatus.OK);
  });
});
