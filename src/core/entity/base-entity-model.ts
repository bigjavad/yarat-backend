import {
    BaseEntity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    VersionColumn
} from "typeorm";
export class BaseEntityModel extends BaseEntity {
    @PrimaryGeneratedColumn({type: 'bigint' })
    id: number;
    @CreateDateColumn({ type: 'timestamp',update:false })
    createdDate: Date;
    @UpdateDateColumn({ type: 'timestamp'})
    lastUpdate: Date;

    @VersionColumn({ default: 1 })
    version: number;

    @Column({ nullable: true,default:1 })
    creatorId: number;

    @Column({ nullable: true })
    createdBy: string;

    @Column({ nullable: true })
    updaterId: number;

    @Column({ nullable: true })
    updatedBy: string;

    @Column({ nullable: true })
    clientIp: string;
    @Column({ nullable: true })
    userAgent: string;

}

