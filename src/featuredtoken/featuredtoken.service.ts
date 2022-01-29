import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { formatDate } from 'src/common/utils/date.util';
import { FeaturedToken } from 'src/featuredtoken/entities/featuredtoken.entity';
import { Between, Raw, Repository, getManager } from 'typeorm';
import { getFromDto } from '../common/utils/repository.util';

@Injectable()
export class FeaturedTokenService {
  constructor(
    @InjectRepository(FeaturedToken)
    private readonly featuredTokenRepository: Repository<FeaturedToken>,
  ) {}

  async createFeaturedToken(payload: any, throwError = true): Promise<FeaturedToken> {
    const featured_token: FeaturedToken = getFromDto(payload, new FeaturedToken());    
    await this.featuredTokenRepository.save(featured_token);

    return this.featuredTokenRepository.findOne({
        where: { id: featured_token.id }
    })
  }

  async getFeaturedTokens(query: any): Promise<FeaturedToken[]> {

    let queryParam: any = query.start_date && query.end_date ? {date: Between(query.start_date, query.end_date)} : {};
    
    return this.featuredTokenRepository.find({
      where: queryParam,
      relations: ['creator']
    })
  }

  async getUserFeaturedToken(query: any): Promise<FeaturedToken[]> {

    let queryParam: any = query.start_date && query.end_date ? {date: Between(query.start_date, query.end_date)} : {};
    queryParam.creator = query.user_id;
    
    return this.featuredTokenRepository.find({
      where: queryParam,
      relations: ['creator']
    })
  }

  async deleteFeaturedToken(id): Promise<any> {
    const result = await this.featuredTokenRepository.delete(id);
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
        featured_tokens
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