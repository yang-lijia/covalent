import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn , UpdateDateColumn} from 'typeorm';
import {Chatgroup} from './Chatgroup';
import {Question} from './Question';
@Entity()
export class Survey {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    interval: number;

    @ManyToOne((type) => Chatgroup, (chatgroup) => chatgroup.surveys)
    chatgroup: Chatgroup;

    @OneToMany((type) => Question, (question) => question.survey)
    questions: Question[];

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;
}
