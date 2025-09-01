import {Column, Entity, OneToMany} from "typeorm";
import {BasePopularModel} from "../../core/entity/base-popular-model";
import {CityEntity} from "../city/city.entity";
import {PostCommentEntity} from "../post/post-comment.entity";
import {PropertyValueEntity} from "./property-value.entity";

@Entity("property")
export class PropertyEntity extends BasePopularModel {
    @Column({nullable:false })
    title: string;
    @Column({nullable:false })
    serialNumber:string;
}
