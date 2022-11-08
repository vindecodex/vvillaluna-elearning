import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserCredentialsDto } from '../src/auth/dto/user-credentials.dto';
import { AuthService } from '../src/auth/service/auth.service';
import { Role } from '../src/authorization/enums/role.enum';
import { User } from '../src/user/entities/user.entity';

export const testHelper = {
  actors: async (app: INestApplication) => {
    const { createUser, getUserToken } = helpers(app);
    const { ADMIN, INSTRUCTOR, STUDENT } = Role;

    const admin = await createUser(ADMIN);
    const instructorA = await createUser(INSTRUCTOR, 'instructorA');
    const instructorB = await createUser(INSTRUCTOR, 'instructorB');
    const studentA = await createUser(STUDENT, 'studentA');
    const studentB = await createUser(STUDENT, 'studentB');

    return {
      admin: getUserToken(admin),
      instructorA: getUserToken(instructorA),
      instructorB: getUserToken(instructorB),
      studentA: getUserToken(studentA),
      studentB: getUserToken(studentB),
    };
  },

  mocks: {
    mailService: {
      sendVerification: () => true,
      sendResetPasswordLink: () => true,
      sendAccountNotFound: () => true,
    },
  },
};

const helpers = (app: INestApplication) => ({
  createUser: async (role: Role, email?: string): Promise<User> => {
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
  },
  getUserToken: (user: User): string => app.get(JwtService).sign({ ...user }),
});
