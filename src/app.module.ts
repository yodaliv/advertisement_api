import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as ormConfig from './ormconfig';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './common/upload/upload.module';
import { BannerModule } from './banner/banner.module';
import { SettingModule } from './setting/setting.module';
import { SeedModule } from './common/seed/seed.module';
import { TopButtonModule } from './topbutton/topbutton.module';
import { TopSponsorModule } from './topsponsor/topsponsor.module';
import { FeaturedTokenModule } from './featuredtoken/featuredtoken.module';
import { SearchBarModule } from './searchbar/searchbar.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    ScheduleModule.forRoot(),
    AuthModule,
    UploadModule,
    BannerModule,
    TopButtonModule,
    TopSponsorModule,
    FeaturedTokenModule,
    SearchBarModule,
    SettingModule,
    SeedModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
