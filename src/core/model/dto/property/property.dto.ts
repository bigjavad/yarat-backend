import {BaseEntityModel} from "../../../entity/base-entity-model";
import {IsNotEmpty, IsString} from "class-validator";

export class PropertyDto extends BaseEntityModel {
    @IsNotEmpty()
    @IsString()
    title: string;
    @IsNotEmpty()
    @IsString()
    serialNumber:string;
}
