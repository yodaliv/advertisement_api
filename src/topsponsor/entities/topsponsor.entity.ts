import { Column, Entity, BeforeInsert, Exclusion, OneToMany, ManyToOne } from 'typeorm';
import { SoftDelete } from 'src/common/core/soft-delete';
import { User } from 'src/user/entities/user.entity';
import { TopSponsorType } from '../enums/topsponsor.enum';

@Entity('top_sponsors')
export class TopSponsor extends SoftDelete {
    
    @Column()
    type: TopSponsorType;

    @Column()
    date: string;

    @Column()
    image: string;

    @Column()
    name: string;

    @Column("text")
    description: string;

    @Column()
    link: string;

    @Column()
    web: string;

    @Column()
    facebook: string;

    @Column()
    twitter: string;

    @Column()
    linkedin: string;

    @Column()
    telegram: string;

    @ManyToOne(() => User, user => user.top_sponsors)
    creator: User;

    @Column()
    credits: number;
}