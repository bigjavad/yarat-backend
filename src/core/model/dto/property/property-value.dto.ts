import {BaseEntityModel} from "../../../entity/base-entity-model";
import {Column} from "typeorm";
import {IsNotEmpty, IsNumber, IsString} from "class-validator";
import {PropertyEntity} from "../../../../entity/property/property.entity";

export class PropertyValueDto extends BaseEntityModel {
    @IsNotEmpty()
    @IsString()
    title: string;
    @IsNotEmpty()
    @IsString()
    serialNumber:string;
    @IsNotEmpty()
    @IsNumber()
    propertyId:string;
}
