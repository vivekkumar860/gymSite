import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DOMAIN_EVENTS } from '../../../common/constants';
import { ProfileService } from '../services/profile.service';
import { UserRegisteredEvent } from '../../auth/events/user-registered.event';

/** Listens for USER_REGISTERED events and creates a blank profile. */
@Injectable()
export class ProfileCreationListener {
  private readonly logger = new Logger(ProfileCreationListener.name);

  constructor(private readonly profileService: ProfileService) {}

  @OnEvent(DOMAIN_EVENTS.USER_REGISTERED)
  async handleUserRegistered(event: UserRegisteredEvent): Promise<void> {
    this.logger.log(`Creating profile for user ${event.userId}`);
    await this.profileService.createBlankProfile(event.userId);
  }
}
