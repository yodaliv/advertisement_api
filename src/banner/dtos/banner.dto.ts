import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { BannerType } from '../enums/banner-type.enum';

export class BannerDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly type: BannerType;

  @ApiProperty()
  readonly date: string;

  @ApiProperty()
  readonly image: string;

  @ApiProperty()
  readonly link: string;

  @ApiProperty()
  readonly creator: User;

  @ApiProperty()
  readonly credits: number;
}