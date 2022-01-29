import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmailModule } from 'src/kit/email/email.module';
import { UploadModule } from 'src/common/upload/upload.module';
import { SettingModule } from 'src/setting/setting.module';
import { UserModule } from 'src/user/user.module';
import { FeaturedToken } from './entities/featuredtoken.entity';
import { FeaturedTokenController } from './featuredtoken.controller';
import { FeaturedTokenService } from './featuredtoken.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeaturedToken]),
    EmailModule,
    UploadModule,
    SettingModule,
    UserModule
  ],
  controllers: [FeaturedTokenController],
  providers: [FeaturedTokenService],
  exports: [FeaturedTokenService],
})
export class FeaturedTokenModule {}