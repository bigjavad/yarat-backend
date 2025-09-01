import {Column, Entity} from "typeorm";
import {BaseEntityModel} from "../../core/entity/base-entity-model";

@Entity("logger")
export class LoggerEntity extends BaseEntityModel{
    @Column({nullable: false})
    method:string;
    @Column({nullable: false})
    baseUrl:string;
    @Column({nullable: false})
    statusCode:number;
    @Column({nullable: false, default: 0})
    contentLength:string;
    @Column({nullable: false})
    responseTime:string;
    @Column({nullable: true})
    userAgent:string;
    @Column({nullable: false})
    ip:string;
}
