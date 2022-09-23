import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerServer: MailerService) {}

  async sendVerification(user: User, token: string) {
    const activitionLink = `http://localhost:3000/signup/verification?token=${token}`;
    const res = await this.mailerServer.sendMail({
      to: user.email,
      subject: 'Account Verification',
      html: `Click this link to <a href="${activitionLink}">verify account</a>`,
    });
    return res;
  }
}
