import { Injectable, Logger } from '@nestjs/common';
import { EmailPort, SendEmailOptions } from './email.port';

/** Logs emails to console — used in development only. */
@Injectable()
export class ConsoleEmailAdapter extends EmailPort {
  private readonly logger = new Logger(ConsoleEmailAdapter.name);

  async send(options: SendEmailOptions): Promise<void> {
    this.logger.log(`Email to: ${options.to}`);
    this.logger.log(`Subject: ${options.subject}`);
    this.logger.debug(`Body: ${options.html}`);
  }
}
