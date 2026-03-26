import { Module } from '@nestjs/common';
import { ProfileController } from './controllers/profile.controller';
import { ProfileService } from './services/profile.service';
import { ProfileRepository } from './repositories/profile.repository';
import { ProfileCreationListener } from './listeners/profile-creation.listener';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, ProfileRepository, ProfileCreationListener],
  exports: [ProfileService],
})
export class ProfilesModule {}
