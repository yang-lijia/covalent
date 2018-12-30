import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn , UpdateDateColumn} from 'typeorm';

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

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;

    // surveyid FK to Survey
}
