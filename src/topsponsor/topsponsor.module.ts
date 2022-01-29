import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmailModule } from 'src/kit/email/email.module';
import { UploadModule } from 'src/common/upload/upload.module';
import { SettingModule } from 'src/setting/setting.module';
import { UserModule } from 'src/user/user.module';
import { TopSponsorService } from './topsponsor.service';
import { TopSponsor } from './entities/topsponsor.entity';
import { TopSponsorController } from './topsponsor.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TopSponsor]),
    EmailModule,
    UploadModule,
    SettingModule,
    UserModule
  ],
  controllers: [TopSponsorController],
  providers: [TopSponsorService],
  exports: [TopSponsorService],
})
export class TopSponsorModule {}