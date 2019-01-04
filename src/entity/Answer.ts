import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn , UpdateDateColumn} from 'typeorm';
import {Question} from './Question';
@Entity()
export class Answer {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    answer: string;

    @ManyToOne((type) => Question, (question) => question.answers)
    question: Question;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;

}
