import {Column, Entity, OneToMany} from "typeorm";
import {CityEntity} from "../city/city.entity";
import {BaseEntityModel} from "../../core/entity/base-entity-model";

@Entity("province")
export class ProvinceEntity extends BaseEntityModel {
    @Column({nullable:false })
    title: string;
    @Column({nullable:false })
    latitude: number;
    @Column({ nullable:false })
    slug: string;
    @Column({nullable:false })
    longitude: number;
    @Column({nullable:true })
    image: string;
    @OneToMany(() => CityEntity, (city:CityEntity) => city.province)
    city: CityEntity[];
}
