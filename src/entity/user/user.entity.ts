import {Entity, Column, ManyToOne, JoinColumn} from "typeorm"
import {BaseEntityModel} from "../../core/entity/base-entity-model";
import {EN_RoleEnum} from "../../core/enum/form/EN_Role.enum";
import {ProvinceEntity} from "../province/province.entity";
import {CityEntity} from "../city/city.entity";


@Entity("user")
export class UserEntity extends BaseEntityModel {
    @Column({ unique: true,nullable:false,update:false})
    phoneNumber: string;
    @Column({select: true, nullable: true})
    password: string;
    @Column({length: 25, nullable: true})
    firstname: string;
    @Column({length: 25, nullable: true})
    lastname: string;
    @Column({type: 'enum', enum: EN_RoleEnum, nullable: false})
    role: EN_RoleEnum;
    @Column({ nullable: true })
    provinceId: number;
    @Column({ nullable: true })
    cityId: number;
    @ManyToOne(() => CityEntity)
    @JoinColumn({ name: 'cityId',referencedColumnName:"id" })
    city: CityEntity;
    @ManyToOne(() => ProvinceEntity)
    @JoinColumn({ name: 'provinceId',referencedColumnName:"id" })
    province: ProvinceEntity;

}
