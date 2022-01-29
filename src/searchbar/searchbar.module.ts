import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmailModule } from 'src/kit/email/email.module';
import { UploadModule } from 'src/common/upload/upload.module';
import { SettingModule } from 'src/setting/setting.module';
import { UserModule } from 'src/user/user.module';
import { SearchBar } from './entities/searchbar.entity';
import { SearchBarController } from './searchbar.controller';
import { SearchBarService } from './searchbar.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SearchBar]),
    EmailModule,
    UploadModule,
    SettingModule,
    UserModule
  ],
  controllers: [SearchBarController],
  providers: [SearchBarService],
  exports: [SearchBarService],
})
export class SearchBarModule {}