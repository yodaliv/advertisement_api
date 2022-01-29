import { Module } from '@nestjs/common';
import { SettingModule } from 'src/setting/setting.module';
import { SeedService } from './seed.service';

@Module({
  imports: [SettingModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
