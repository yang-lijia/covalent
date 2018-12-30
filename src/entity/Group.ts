import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn , UpdateDateColumn} from 'typeorm';

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    name: string;

    @Column('double precision')
    groupId: number;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;
}
