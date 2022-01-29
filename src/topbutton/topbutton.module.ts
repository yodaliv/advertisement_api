import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmailModule } from 'src/kit/email/email.module';
import { UploadModule } from 'src/common/upload/upload.module';
import { SettingModule } from 'src/setting/setting.module';
import { UserModule } from 'src/user/user.module';
import { TopButtonController } from './topbutton.controller';
import { TopButtonService } from './topbutton.service';
import { TopButton } from './entities/topbutton.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TopButton]),
    EmailModule,
    UploadModule,
    SettingModule,
    UserModule
  ],
  controllers: [TopButtonController],
  providers: [TopButtonService],
  exports: [TopButtonService],
})
export class TopButtonModule {}