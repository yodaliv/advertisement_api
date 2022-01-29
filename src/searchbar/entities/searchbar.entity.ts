import { Column, Entity, BeforeInsert, Exclusion, OneToMany, ManyToOne } from 'typeorm';
import { SoftDelete } from 'src/common/core/soft-delete';
import { User } from 'src/user/entities/user.entity';

@Entity('search_bars')
export class SearchBar extends SoftDelete {
    @Column()
    network: string;

    @Column()
    date: string;

    @Column()
    name: string;

    @Column()
    link: string;

    @ManyToOne(() => User, user => user.search_bars)
    creator: User;

    @Column()
    credits: number;
}