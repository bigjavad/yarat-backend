import {BaseEntityModel} from "../../../entity/base-entity-model";
import {IsNotEmpty, IsString} from "class-validator";

export class CarBodyColorDto extends BaseEntityModel {
    @IsNotEmpty()
    @IsString()
    color:string;
    @IsNotEmpty()
    @IsString()
    name:string;
    image:string;
}
