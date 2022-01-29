import { Column, Entity, BeforeInsert, Exclusion, OneToMany, ManyToOne } from 'typeorm';
import { SoftDelete } from 'src/common/core/soft-delete';
import { User } from 'src/user/entities/user.entity';
import { FeaturedTokenType } from '../enums/featuredtoken.enum';

@Entity('featured_tokens')
export class FeaturedToken extends SoftDelete {
    @Column()
    network: string;
    
    @Column()
    type: FeaturedTokenType;

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

    @ManyToOne(() => User, user => user.featured_tokens)
    creator: User;

    @Column()
    credits: number;
}