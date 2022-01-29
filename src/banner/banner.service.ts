import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { formatDate } from 'src/common/utils/date.util';
import { Between, Raw, Repository, getManager } from 'typeorm';

import { getFromDto } from '../common/utils/repository.util';
import { Banner } from './entities/banner.entity';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
  ) {}

  async createBanner(payload: any, throwError = true): Promise<Banner> {
    const banner: Banner = getFromDto(payload, new Banner());    
    await this.bannerRepository.save(banner);

    return this.bannerRepository.findOne({
        where: { id: banner.id }
    })
  }

  async getBanners(query: any): Promise<Banner[]> {

    let queryParam: any = query.start_date && query.end_date ? {date: Between(query.start_date, query.end_date)} : {};
    
    return this.bannerRepository.find({
      where: queryParam,
      relations: ['creator']
    })
  }

  async getUserBanner(query: any): Promise<Banner[]> {

    let queryParam: any = query.start_date && query.end_date ? {date: Between(query.start_date, query.end_date)} : {};
    queryParam.creator = query.user_id;
    
    return this.bannerRepository.find({
      where: queryParam,
    })
  }

  async deleteBanner(id): Promise<any> {
    const result = await this.bannerRepository.delete(id);
    console.log('delete: ', result);
    return result;
  }

  async checkDate(payload: any): Promise<boolean> {
    const type = payload.type;
    const date = payload.date;

    const disableDates = await this.getDisabledDates();
    const sDate = disableDates.find(i => i.date == date);
    if (!sDate) {
        return true;
    } else if(type == 'EXCLUSIVE') {
        return false;
    } else if (type == 'NORMAL' && Number(sDate.cc) > 2) {
        return false;
    }

    return true;
  }

  async getDisabledDates() {
    const today = formatDate(new Date());
    const entityManager = getManager();
    const query = `
      SELECT
        date, sum(cc) as cc
      FROM
        (
          (
            SELECT
              count(*) * 3 AS cc,
              date,
              type
            FROM
              banners
            WHERE
              type = 'EXCLUSIVE' AND date >= '${today}'
            GROUP BY
              date,
              type
          )
          UNION
            (
              SELECT
                count(*) AS cc,
                date,
                type
              FROM
                banners
              WHERE
                type = 'NORMAL' AND date >= '${today}'
              GROUP BY
                date,
                type
            )
        ) t1 GROUP BY date
    `

    const rawData = await entityManager.query(query);
    return rawData;
  }
}