import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {Group} from './Group';

@Entity()
export class Administrator {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int')
    userId: number;

    @ManyToOne(type => Group, (group) => group.administrators)
    group: Group;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;
}
