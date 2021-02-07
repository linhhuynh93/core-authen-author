import { inject, injectable } from "inversify";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { AuthenticationConfig } from "src/configs/appConfig";
import { TYPES } from "src/injection/types";



export interface SendEmailUtil {
  sendEmail(
    fromEmail: string,
    toEmails: string[],
    subject: string,
    emailBody: string
  ): Promise<void>;
}

@injectable()
export class SendEmailUtilImpl implements SendEmailUtil {
  private mailer: Mail;
  constructor(
    @inject(TYPES.AuthenticationConfig)
    private readonly authenticationConfig: AuthenticationConfig
  ) {
    this.mailer = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: authenticationConfig.mailSystemUsername,
        pass: authenticationConfig.mailSystemUsername,
      },
    });
  }

  public async sendEmail(
    fromEmail: string,
    toEmails: string[],
    subject: string,
    emailBody: string
  ) {
    const mailOptions = {
      from: fromEmail,
      to: toEmails.join(),
      subject: subject,
      text: emailBody
    }

    await this.mailer.sendMail(mailOptions);
  }
}
