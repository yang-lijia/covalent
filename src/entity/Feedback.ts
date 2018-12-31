import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn , UpdateDateColumn} from 'typeorm';
import {Group} from './Group';
@Entity()
export class Feedback {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    feedback: string;

    @ManyToOne(type => Group, (group) => group.feedbacks)
    group: Group;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;

    // Question id FK
    // @Column('double precision')
    // groupId: number;
}
