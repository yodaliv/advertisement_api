import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { FeaturedTokenType } from '../enums/featuredtoken.enum';

export class TopSponsorDto {
  @ApiProperty()
  readonly id: string;
  
  @ApiProperty()
  readonly date: string;

  @ApiProperty()
  readonly image: string;

  @ApiProperty()
  readonly network: string;

  @ApiProperty()
  readonly type: FeaturedTokenType;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly description: string;

  @ApiProperty()
  readonly link: string;

  @ApiProperty()
  readonly web: string;

  @ApiProperty()
  readonly facebook: string;

  @ApiProperty()
  readonly twitter: string;

  @ApiProperty()
  readonly linkedin: string;

  @ApiProperty()
  readonly telegram: string;

  @ApiProperty()
  readonly creator: User;

  @ApiProperty()
  readonly credits: number;
}