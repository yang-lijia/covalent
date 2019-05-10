import {Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn} from 'typeorm';
import {Chatgroup} from './Chatgroup';

@Entity()
@Unique(['userId'])
export class Administrator {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('bigint')
    userId: number;

    @ManyToMany((type) => Chatgroup, (chatgroup) => chatgroup.administrators, {
        eager: true,
    })
    @JoinTable()
    chatgroups: Chatgroup[];

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;
}
