import {BaseEntityModel} from "../../../entity/base-entity-model";
import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class ProvinceDto extends BaseEntityModel{
    @IsNotEmpty()
    @IsString()
    title: string;
    @IsNotEmpty()
    @IsNumber()
    latitude: number;
    @IsNotEmpty()
    @IsNumber()
    longitude: number;
    @IsString()
    image: string;
}
