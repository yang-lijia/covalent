import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn , UpdateDateColumn} from 'typeorm';
import {Answer} from './Answer';
import {Survey} from './Survey';

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    question: string;

    @Column('simple-json')
    option: any;

    @Column('boolean')
    isUsed: boolean;

    @ManyToOne((type) => Survey, (survey) => survey.questions)
    survey: Survey;

    @OneToMany((type) => Answer, (answer) => answer.question)
    answers: Answer[];

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;

    // surveyid FK to Survey
}
