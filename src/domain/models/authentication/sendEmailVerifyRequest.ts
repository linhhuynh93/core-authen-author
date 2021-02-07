import * as joi from "joi";
import { IllegalParameterError } from "src/errors/illegalParameterError";

export class SendEmailVerifyRequest {
  constructor(
    public readonly fromEmail: string,
    public readonly toEmail: string,
    public readonly htmlTemplate: string,
    public param: {
      id: number;
      firstName: string;
      lastName: string;
      verifyCode: string;
      dateTimeVerifyCode: Date;
    }
  ) {}
}
