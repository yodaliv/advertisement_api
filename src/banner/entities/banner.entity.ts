import { Column, Entity, BeforeInsert, Exclusion, OneToMany, ManyToOne } from 'typeorm';
import { SoftDelete } from 'src/common/core/soft-delete';
import { BannerType } from '../enums/banner-type.enum';
import { User } from 'src/user/entities/user.entity';

@Entity('banners')
export class Banner extends SoftDelete {
    
    @Column()
    type: BannerType;

    @Column()
    date: string;

    @Column()
    image: string;

    @Column()
    link: string;

    @ManyToOne(() => User, user => user.banners)
    creator: User;

    @Column()
    credits: number;
}
