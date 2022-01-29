import { Injectable } from '@nestjs/common';
import { SettingService } from 'src/setting/setting.service';

import { prices } from './seed_prices';

@Injectable()
export class SeedService {
  constructor(private readonly settingService: SettingService) {}

  async startDevelopmentSeed() {
    await this.seedPrices();
  }

  async seedPrices() {
    await Promise.all(
      prices.map(async (price) => {
        await this.settingService.addPrice(price as any, false);
      }),
    );
  }
}