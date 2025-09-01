import {Column, Check, ManyToMany, JoinTable, Entity, JoinColumn, ManyToOne, BeforeInsert, BeforeUpdate} from "typeorm";
import {BasePopularModel} from "../../core/entity/base-popular-model";
import {UserEntity} from "../user/user.entity";
import {CarPropertyDto} from "../../core/model/dto/car/car-property.dto";
import {CarBodyColorEntity} from "./car-body-color.entity";
import {EN_PostStatusEnum} from "../../core/enum/form/EN_PostStatus.enum";
import {EN_CarStatusEnum} from "../../core/enum/form/EN_CarStatus.enum";
import {PropertyValueEntity} from "../property/property-value.entity";
import {EN_CarCategoryEnum} from "../../core/enum/form/EN_CarCategory.enum";
import {CreatorSlug} from "../../core/utility/creator-slug";

@Entity("car")
export class CarEntity extends BasePopularModel{
    @Column({nullable: false})
    title: string;
    @Column({nullable: true})
    slug: string;
    @Column("simple-json", { nullable: false })
    image: string[];
    @Column({nullable: false})
    description:string;
    @Column({nullable: false})
    body:string;
    @Column({nullable: false})
    capacity:number;
    @Column({nullable: false})
    price:number;
    @Column({nullable: false})
    hasDiscount:boolean;
    @Column({nullable: true})
    @Check(`("hasDiscount" = false AND "discount" IS NULL) OR ("hasDiscount" = true AND "discount" IS NOT NULL)`)
    discount:number;
    @Column("simple-json", { nullable: false })
    carBodyColorId: number[];
    @Column("simple-json", { nullable: false })
    engine:CarPropertyDto[];
    @Column("simple-json", { nullable: false })
    suspensions:CarPropertyDto[];
    @Column("simple-json", { nullable: false })
    tire:CarPropertyDto[];
    @Column("simple-json", { nullable: false })
    break:CarPropertyDto[];
    @Column("simple-json", { nullable: false })
    dimensionsCapacity: CarPropertyDto[];
    @Column("simple-json", { nullable: false })
    expert:CarPropertyDto[];
    @Column("simple-json", { nullable: false })
    facilities:string[];
    @Column("simple-json", { nullable: true })
    warranty:CarPropertyDto[];
    @Column({
        type: 'enum',
        enum: EN_CarStatusEnum,
        nullable: false
    })
    carStatus: EN_CarStatusEnum;
    @Column({
        type: 'enum',
        enum: EN_CarCategoryEnum,
        nullable: false
    })
    carCategory: EN_CarCategoryEnum;
    @ManyToOne(() => UserEntity, {nullable: false,onDelete:"CASCADE"})
    @JoinColumn({name: 'creatorId', referencedColumnName: "id"})
    creator: UserEntity;

    @BeforeInsert()
    @BeforeUpdate()
    generateSlug() {
        this.slug = CreatorSlug([this.title]);
    }
}
