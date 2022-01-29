import { ApiProperty } from '@nestjs/swagger';
import { Banner } from 'src/banner/entities/banner.entity';
import { FeaturedToken } from 'src/featuredtoken/entities/featuredtoken.entity';
import { SearchBar } from 'src/searchbar/entities/searchbar.entity';
import { TopButton } from 'src/topbutton/entities/topbutton.entity';
import { TopSponsor } from 'src/topsponsor/entities/topsponsor.entity';

export class UserDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly wallet_address: string;

  @ApiProperty()
  readonly role: string;

  @ApiProperty()
  readonly credits: number;

  @ApiProperty()
  readonly banners: Banner[];

  @ApiProperty()
  readonly top_buttons: TopButton[];

  @ApiProperty()
  readonly top_sponsors: TopSponsor[];

  @ApiProperty()
  readonly featured_tokens: FeaturedToken[];

  @ApiProperty()
  readonly search_bars: SearchBar[];
}
