import { Column, Entity, BeforeInsert, Exclusion, OneToMany, ManyToOne } from 'typeorm';
import { SoftDelete } from 'src/common/core/soft-delete';

@Entity('prices')
export class Price extends SoftDelete {
    @Column()
    name: string;

    @Column()
    price: number;
}
