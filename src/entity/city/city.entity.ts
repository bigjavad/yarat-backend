import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {BaseEntityModel} from "../../core/entity/base-entity-model";
import {ProvinceEntity} from "../province/province.entity";

@Entity("city")
export class CityEntity extends BaseEntityModel{
    @Column({ nullable: false })
    provinceId: number;
    @Column({  nullable:false })
    slug: string;
    @Column({ nullable:false })
    title: string;
    @Column({ nullable:false })
    latitude: number;
    @Column({nullable:false })
    longitude: number;

    @ManyToOne(() => ProvinceEntity, (province:ProvinceEntity) => province.city, {eager: true, onDelete: 'CASCADE'})
    @JoinColumn({ name: 'provinceId',referencedColumnName: "id" })
    province: ProvinceEntity;
}
