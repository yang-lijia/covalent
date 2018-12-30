import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn , UpdateDateColumn} from 'typeorm';

@Entity()
export class Answer {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    answer: string;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;

    // Question id FK

}
