import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Raw, Repository } from 'typeorm';

import { getFromDto } from '../common/utils/repository.util';
import { Price } from './entities/price.entity';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,
  ) {}

  async addPrice(payload: any, throwError = true) {
    const found = await this.findPriceByName(payload.name);
    if (found) {
      if (throwError) {
        throw new BadRequestException('The price already added');
      } else {
        return found;
      }
    }
    const price: Price = getFromDto(payload, new Price());
    await this.priceRepository.save(price);

    return await this.findPriceByName(payload.name);
  }

  async findPriceByName(name: string): Promise<Price> {
    return this.priceRepository.findOne({
      where: { name: name },
    });
  }

  async getPrice(name: string): Promise<any> {
    const price = await this.priceRepository.findOne({
        where: { name: name },
    });  
    if (price) return price.price;
    return 0
  }

  async setPrice(name: string, price: any): Promise<any> {
    let priceItem = await this.priceRepository.findOne({
        where: { name: name },
    }); 
    if (!priceItem) priceItem = new Price(); 
    priceItem.name = name;
    priceItem.price = price;
    await this.priceRepository.save(priceItem);
    return priceItem;
  }

  async getPrices(names: []): Promise<Price[]> {
    return this.priceRepository.find({
        where: { name: name },
    });  
  }
  
}