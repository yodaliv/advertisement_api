import { Column, Entity, BeforeInsert, Exclusion, OneToMany } from 'typeorm';
import { SoftDelete } from 'src/common/core/soft-delete';
import { UserDto } from '../dtos/user.dto';
import { UserRole } from '../enums/user-role.enum';
import { Banner } from 'src/banner/entities/banner.entity';
import { TopButton } from 'src/topbutton/entities/topbutton.entity';
import { TopSponsor } from 'src/topsponsor/entities/topsponsor.entity';
import { FeaturedToken } from 'src/featuredtoken/entities/featuredtoken.entity';
import { SearchBar } from 'src/searchbar/entities/searchbar.entity';

@Entity('users')
export class User extends SoftDelete {
  @Column({ nullable: true, default: UserRole.Customer })
  role: UserRole;


  @Column({ nullable: true })
  wallet_address: string;

  @Column({ default: 0 })
  credits: number;

  @OneToMany(() => Banner, banner => banner.creator )
  banners: Banner[]

  @OneToMany(() => TopButton, top_button => top_button.creator )
  top_buttons: TopButton[]

  @OneToMany(() => TopSponsor, top_sponsor => top_sponsor.creator )
  top_sponsors: TopSponsor[]

  @OneToMany(() => FeaturedToken, featured_token => featured_token.creator )
  featured_tokens: FeaturedToken[]

  @OneToMany(() => SearchBar, search_bar => search_bar.creator )
  search_bars: SearchBar[]

  toUserDto(): UserDto {
    return {
      id: this.id,
      wallet_address: this.wallet_address,
      role: this.role,
      credits: this.credits,
      banners: this.banners,
      top_buttons: this.top_buttons,
      top_sponsors: this.top_sponsors,
      featured_tokens: this.featured_tokens,
      search_bars: this.search_bars,
    };
  }
}
