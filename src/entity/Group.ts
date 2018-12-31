import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn , UpdateDateColumn} from 'typeorm';
import {Administrator} from './Administrator';
import {Feedback} from './Feedback';
import {Survey} from './Survey';

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    name: string;

    @Column('double precision')
    groupId: number;

    @OneToMany(type => Administrator, (administrator) => administrator.group)
    administrators: Administrator[];

    @OneToMany(type => Feedback, (feedback) => feedback.group)
    feedbacks: Feedback[];

    @OneToMany(type => Survey, (survey) => survey.group)
    surveys: Survey[];

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;
}
