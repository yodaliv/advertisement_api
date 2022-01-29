import { Column, Entity, BeforeInsert, Exclusion, OneToMany, ManyToOne } from 'typeorm';
import { SoftDelete } from 'src/common/core/soft-delete';
import { User } from 'src/user/entities/user.entity';
import { TopButtonType } from '../enums/topbutton.enum';

@Entity('top_buttons')
export class TopButton extends SoftDelete {
    
    @Column()
    type: TopButtonType;

    @Column()
    date: string;

    @Column()
    text: string;

    @Column()
    link: string;

    @ManyToOne(() => User, user => user.top_buttons)
    creator: User;

    @Column()
    credits: number;
}