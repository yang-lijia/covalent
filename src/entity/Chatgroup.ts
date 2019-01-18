import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn , Unique, UpdateDateColumn, ManyToMany} from 'typeorm';
import {Feedback} from './Feedback';
import {Survey} from './Survey';
import {Administrator} from "./Administrator";


@Entity()
@Unique(['chatgroupId'])
export class Chatgroup {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    name: string;

    @Column('bigint')
    chatgroupId: number;

    @ManyToMany(type => Administrator, administrator => administrator.chatgroups)
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
