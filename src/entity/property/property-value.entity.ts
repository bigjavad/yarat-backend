import {Column, Entity} from "typeorm";
import {BasePopularModel} from "../../core/entity/base-popular-model";

@Entity("property-value")
export class PropertyValueEntity extends BasePopularModel {
    @Column({nullable:false })
    title: string;
    @Column({nullable:false })
    serialNumber:string;
    @Column({nullable:false })
    propertyId:string;
}
