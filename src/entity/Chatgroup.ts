import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Administrator } from './Administrator';
import { Feedback } from './Feedback';
import { Survey } from './Survey';

@Entity()
@Unique(['chatgroupId'])
export class Chatgroup {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    name: string;

    @Column('bigint')
    chatgroupId: number;

    @ManyToMany((type) => Administrator, (administrator) => administrator.chatgroups)
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
