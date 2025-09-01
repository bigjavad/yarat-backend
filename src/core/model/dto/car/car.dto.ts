import {BaseEntityModel} from "../../../entity/base-entity-model";
import {EN_CarStatusEnum} from "../../../enum/form/EN_CarStatus.enum";
import {Column} from "typeorm";
import {CarPropertyDto} from "./car-property.dto";
import {
    ArrayNotEmpty,
    IsArray,
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsString,
    ValidateIf,
    ValidateNested
} from "class-validator";
import {Type} from "class-transformer";
import {EN_CarCategoryEnum} from "../../../enum/form/EN_CarCategory.enum";

export class CarDto extends BaseEntityModel {
    @IsNotEmpty()
    @IsString()
    title: string;
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    image: string[];
    @IsNotEmpty()
    @IsString()
    description:string;
    @IsNotEmpty()
    @IsString()
    body:string;
    @IsNotEmpty()
    @IsNumber()
    capacity:number;
    @IsNotEmpty()
    @IsEnum(EN_CarCategoryEnum)
    carCategory: EN_CarCategoryEnum;
    @IsNotEmpty()
    @IsNumber()
    price:number;
    @IsNotEmpty()
    @IsBoolean()
    hasDiscount:boolean;
    @IsNumber()
    @ValidateIf(car => car.hasDiscount === true)
    @Column({nullable: true})
    discount:number;
    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    carBodyColorId: number[];
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CarPropertyDto)
    engine:CarPropertyDto[];
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CarPropertyDto)
    suspensions:CarPropertyDto[];
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CarPropertyDto)
    tire:CarPropertyDto[];
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CarPropertyDto)
    break:CarPropertyDto[];
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CarPropertyDto)
    dimensionsCapacity: CarPropertyDto[];
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CarPropertyDto)
    expert:CarPropertyDto[];
    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    facilities:string[];
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CarPropertyDto)
    warranty:CarPropertyDto[];
    @IsNotEmpty()
    @IsEnum(EN_CarStatusEnum)
    carStatus: EN_CarStatusEnum;

    facilitiesList:CarPropertyDto[];


}
