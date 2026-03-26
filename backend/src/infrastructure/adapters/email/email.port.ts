/** Abstract port for email sending — services depend on this, not on SendGrid/SES. */
export abstract class EmailPort {
  /** Send an email to a single recipient. */
  abstract send(options: SendEmailOptions): Promise<void>;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}
