import {Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {Chatgroup} from './Chatgroup';

@Entity()
export class Administrator {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('bigint')
    userId: number;

    @ManyToMany((type) => Chatgroup, chatgroup => chatgroup.administrators)
    @JoinTable()
    chatgroups: Chatgroup[];

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;
}
