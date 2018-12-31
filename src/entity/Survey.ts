import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn , UpdateDateColumn} from 'typeorm';
import {Group} from './Group';
import {Question} from './Question';
@Entity()
export class Survey {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    interval: number;

    @ManyToOne(type => Group, (group) => group.surveys)
    group: Group;

    @OneToMany(type => Question, (question) => question.survey)
    questions: Question[];

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;
}
