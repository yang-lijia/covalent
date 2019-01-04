import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn , UpdateDateColumn} from 'typeorm';
import {Chatgroup} from './Chatgroup';
@Entity()
export class Feedback {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    feedback: string;

    @ManyToOne(type => Chatgroup, (chatgroup) => chatgroup.feedbacks)
    chatgroup: Chatgroup;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;

}
