import { Test, TestingModule } from '@nestjs/testing';
import {
  ClassSerializerInterceptor,
  HttpStatus,
  INestApplication,
} from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';
import { MailService } from '../../src/mail/mail.service';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

// Mock Service
const mailService = {
  sendVerification: () => true,
  sendResetPasswordLink: () => true,
  sendAccountNotFound: () => true,
};

// Auth payload
const payload = {
  email: 'test@mail.com',
  password: 'test',
  verifyPassword: 'test',
  role: 'admin',
  firstName: 'admin',
  lastName: 'admin',
};

let token: string;
const newPassword = 'newpass';

describe('Auth Module (e2e)', () => {
  let app: INestApplication;
  let server: any;

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
  });

  afterAll(async () => {
    await app.close();
  });

  it('[POST /signup] - Should create a user', async () => {
    return request(server)
      .post('/signup')
      .send(payload)
      .expect(HttpStatus.CREATED)
      .then((res) => {
        const { id, email, firstName, lastName, role } = res.body;
        token = app.get(JwtService).sign(res.body);
        expect(id).toBeDefined();
        expect(email).toEqual(payload.email);
        expect(firstName).toEqual(payload.firstName);
        expect(lastName).toEqual(payload.lastName);
        expect(role).toEqual(payload.role);
      });
  });

  it('[POST /signup] - Should return Bad Request (400) if verifyPassword did not match with password', async () => {
    return request(server)
      .post('/signup')
      .send({ ...payload, verifyPassword: 'wrong' })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('[POST /signup] - Should return Bad Request (400) if duplicate account', async () => {
    return request(server)
      .post('/signup')
      .send(payload) // payload already used above
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('[GET /signup/verification?token={token}] - Should verify user', async () => {
    return request(server)
      .get(`/signup/verification?token=${token}`)
      .expect(HttpStatus.OK);
  });

  it('[GET /signup/verification?token={token}] - Should return Unauthorized (401) if invalid token', async () => {
    return request(server)
      .get(`/signup/verification?token=${token + 'invalid'}`)
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('[POST /password] - Should reset the password', async () => {
    return request(server)
      .post('/password')
      .set('Authorization', `Bearer ${token}`)
      .send({ password: newPassword, verifyPassword: newPassword })
      .expect(HttpStatus.OK)
      .then((res) => {
        const { status } = res.body;
        expect(status).toEqual('success');
      });
  });

  it('[POST /password] - Should return Bad Request(400) if verifyPassword did not match with password', async () => {
    return request(server)
      .post('/password')
      .set('Authorization', `Bearer ${token}`)
      .send({ password: newPassword, verifyPassword: 'wrong' })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('[POST /login] - Should authenticate a user', async () => {
    return request(server)
      .post('/login')
      .send({ email: payload.email, password: newPassword })
      .expect(HttpStatus.OK)
      .then((res) => {
        const { accessToken } = res.body;
        token = accessToken;
        expect(token).toBeDefined();
      });
  });

  it('[POST /logout] - Should logout a user', async () => {
    return request(server)
      .post('/logout')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK)
      .then((res) => {
        const { status } = res.body;
        expect(status).toEqual('success');
      });
  });

  it('[POST /logout] - Should return Unauthorized (401) using invalid token', async () => {
    return request(server)
      .post('/logout')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.UNAUTHORIZED);
  });
});
