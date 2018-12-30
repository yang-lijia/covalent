import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn , UpdateDateColumn} from 'typeorm';

@Entity()
export class Survey {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    interval: number;

    @Column('double precision')
    groupId: number;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;
}
