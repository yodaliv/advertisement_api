import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { formatDate } from 'src/common/utils/date.util';
import { Between, Raw, Repository, getManager } from 'typeorm';
import { getFromDto } from '../common/utils/repository.util';
import { TopButton } from './entities/topbutton.entity';

@Injectable()
export class TopButtonService {
  constructor(
    @InjectRepository(TopButton)
    private readonly topButtonRepository: Repository<TopButton>,
  ) {}

  async createTopButton(payload: any, throwError = true): Promise<TopButton> {
    const top_button: TopButton = getFromDto(payload, new TopButton());    
    await this.topButtonRepository.save(top_button);

    return this.topButtonRepository.findOne({
        where: { id: top_button.id }
    })
  }

  async getTopButtons(query: any): Promise<TopButton[]> {

    let queryParam: any = query.start_date && query.end_date ? {date: Between(query.start_date, query.end_date)} : {};
    
    return this.topButtonRepository.find({
      where: queryParam,
      relations: ['creator']
    })
  }

  async getUserTopButton(query: any): Promise<TopButton[]> {

    let queryParam: any = query.start_date && query.end_date ? {date: Between(query.start_date, query.end_date)} : {};
    queryParam.creator = query.user_id;
    
    return this.topButtonRepository.find({
      where: queryParam,
      relations: ['creator']
    })
  }

  async deleteTopButton(id): Promise<any> {
    const result = await this.topButtonRepository.delete(id);
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
        top_buttons
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