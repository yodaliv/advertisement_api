import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { formatDate } from 'src/common/utils/date.util';
import { Between, Raw, Repository, getManager } from 'typeorm';
import { getFromDto } from '../common/utils/repository.util';
import { SearchBar } from './entities/searchbar.entity';

@Injectable()
export class SearchBarService {
  constructor(
    @InjectRepository(SearchBar)
    private readonly searchBarRepository: Repository<SearchBar>,
  ) {}

  async createSearchBar(payload: any, throwError = true): Promise<SearchBar> {
    const featured_token: SearchBar = getFromDto(payload, new SearchBar());    
    await this.searchBarRepository.save(featured_token);

    return this.searchBarRepository.findOne({
        where: { id: featured_token.id }
    })
  }

  async getSearchBars(query: any): Promise<SearchBar[]> {

    let queryParam: any = query.start_date && query.end_date ? {date: Between(query.start_date, query.end_date)} : {};
    
    return this.searchBarRepository.find({
      where: queryParam,
      relations: ['creator']
    })
  }

  async getUserSearchBar(query: any): Promise<SearchBar[]> {

    let queryParam: any = query.start_date && query.end_date ? {date: Between(query.start_date, query.end_date)} : {};
    queryParam.creator = query.user_id;
    
    return this.searchBarRepository.find({
      where: queryParam,
      relations: ['creator']
    })
  }

  async deleteSearchBar(id): Promise<any> {
    const result = await this.searchBarRepository.delete(id);
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
        search_bars
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