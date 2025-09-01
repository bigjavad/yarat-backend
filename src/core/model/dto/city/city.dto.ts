import {BaseEntityModel} from "../../../entity/base-entity-model";
import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CityDto extends BaseEntityModel {
    @IsNumber()
    @IsNotEmpty()
    provinceId: number;
    @IsNotEmpty()
    @IsString()
    title: string;
    @IsNumber()
    @IsNotEmpty()
    latitude: number;
    @IsNotEmpty()
    @IsNumber()
    longitude: number;
}
