import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn , UpdateDateColumn} from 'typeorm';

@Entity()
export class Administrator {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int')
    userId: number;

    @Column('double precision')
    groupId: number;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;
}
