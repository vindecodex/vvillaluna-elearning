import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendVerification(user: User, token: string) {
    const activitionLink = `http://localhost:3000/signup/verification?token=${token}`;
    const res = await this.mailerService.sendMail({
      to: user.email,
      subject: 'Account Verification',
      html: `Click this link to <a href="${activitionLink}">verify account</a>`,
    });
    return res;
  }

  async sendAccountNotFound(email: string) {
    const res = await this.mailerService.sendMail({
      to: email,
      subject: 'Account Not Found',
      html: `Sorry your email: ${email} is not in our records`,
    });
    return res;
  }
}
