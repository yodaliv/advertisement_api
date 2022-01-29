import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmailModule } from 'src/kit/email/email.module';
import { UploadModule } from 'src/common/upload/upload.module';
import { Banner } from './entities/banner.entity';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { SettingModule } from 'src/setting/setting.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Banner]),
    EmailModule,
    UploadModule,
    SettingModule,
    UserModule
  ],
  controllers: [BannerController],
  providers: [BannerService],
  exports: [BannerService],
})
export class BannerModule {}
