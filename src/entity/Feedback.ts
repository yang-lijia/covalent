import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn , UpdateDateColumn} from 'typeorm';

@Entity()
export class Feedback {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    feedback: string;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;

    // Question id FK
    // @Column('double precision')
    // groupId: number;
}
