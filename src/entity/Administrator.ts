import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {Chatgroup} from './Chatgroup';

@Entity()
export class Administrator {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('bigint')
    userId: number;

    @ManyToOne(type => Chatgroup, (chatgroup) => chatgroup.administrators)
    chatgroup: Chatgroup;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;
}
