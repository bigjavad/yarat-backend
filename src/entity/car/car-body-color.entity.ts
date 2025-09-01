import {Column, Entity} from "typeorm";
import {BaseEntityModel} from "../../core/entity/base-entity-model";

@Entity("car-body-color")
export class CarBodyColorEntity extends BaseEntityModel{
    @Column({nullable: false})
    name: string;
    @Column({nullable: true})
    image: string;
    @Column({nullable: true})
    color: string;
}
