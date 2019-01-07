import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn , UpdateDateColumn} from 'typeorm';
import {Administrator} from './Administrator';
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

    @OneToMany((type) => Administrator, (administrator) => administrator.chatgroup)
    administrators: Administrator[];

    @OneToMany((type) => Feedback, (feedback) => feedback.chatgroup)
    feedback: Feedback[];

    @OneToMany((type) => Survey, (survey) => survey.chatgroup)
    surveys: Survey[];

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;
}
