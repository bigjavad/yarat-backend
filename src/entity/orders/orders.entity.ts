import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {CarEntity} from "../car/car.entity";
import {UserEntity} from "../user/user.entity";
import {BaseEntityModel} from "../../core/entity/base-entity-model";
import {EN_OrderStatusEnum} from "../../core/enum/form/EN_OrderStatusEnum";

@Entity("orders")
export class OrdersEntity extends BaseEntityModel{
    @Column({nullable:true})
    carId:number;
    @Column({nullable:true})
    content:string;
    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'creatorId',referencedColumnName: "id" })
    user:UserEntity;
    @ManyToOne(() => CarEntity)
    @JoinColumn({ name: 'carId',referencedColumnName: "id" })
    car:CarEntity;
    @Column({
        type: 'enum',
        enum: EN_OrderStatusEnum,
        nullable: false
    })
    orderStatus: EN_OrderStatusEnum;
}
