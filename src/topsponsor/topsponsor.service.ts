import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { formatDate } from 'src/common/utils/date.util';
import { Between, Raw, Repository, getManager } from 'typeorm';
import { getFromDto } from '../common/utils/repository.util';
import { TopSponsor } from './entities/topsponsor.entity';

@Injectable()
export class TopSponsorService {
  constructor(
    @InjectRepository(TopSponsor)
    private readonly topSponsorRepository: Repository<TopSponsor>,
  ) {}

  async createTopSponsor(payload: any, throwError = true): Promise<TopSponsor> {
    const top_sponsor: TopSponsor = getFromDto(payload, new TopSponsor());    
    await this.topSponsorRepository.save(top_sponsor);

    return this.topSponsorRepository.findOne({
        where: { id: top_sponsor.id }
    })
  }

  async getTopSponsors(query: any): Promise<TopSponsor[]> {

    let queryParam: any = query.start_date && query.end_date ? {date: Between(query.start_date, query.end_date)} : {};
    
    return this.topSponsorRepository.find({
      where: queryParam,
      relations: ['creator']
    })
  }

  async getUserTopSponsor(query: any): Promise<TopSponsor[]> {

    let queryParam: any = query.start_date && query.end_date ? {date: Between(query.start_date, query.end_date)} : {};
    queryParam.creator = query.user_id;
    
    return this.topSponsorRepository.find({
      where: queryParam,
      relations: ['creator']
    })
  }

  async deleteTopSponsor(id): Promise<any> {
    const result = await this.topSponsorRepository.delete(id);
    console.log('delete: ', result);
    return result;
  }

  async getDisabledDates() {
    const today = formatDate(new Date());
    const entityManager = getManager();
    const query = `
      SELECT
        count(*) AS cc,
        date
      FROM
        top_sponsors
      WHERE
        date >= '${today}'
      GROUP BY
        date
    `

    const rawData = await entityManager.query(query);
    return rawData;
  }

  async checkDate(payload: any): Promise<boolean> {
    const date = payload.date;

    const disableDates = await this.getDisabledDates();
    const sDate = disableDates.find(i => i.date == date);
    if (sDate) {
      return false;
    }

    return true;
  }
}