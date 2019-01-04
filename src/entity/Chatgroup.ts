import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn , UpdateDateColumn} from 'typeorm';
import {Feedback} from './Feedback';
import {Survey} from './Survey';

@Entity()
export class Chatgroup {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    name: string;

    @Column('bigint')
    chatgroupId: number;

    @OneToMany((type) => Feedback, (feedback) => feedback.chatgroup)
    feedbacks: Feedback[];

    @OneToMany((type) => Survey, (survey) => survey.chatgroup)
    surveys: Survey[];

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;
}
