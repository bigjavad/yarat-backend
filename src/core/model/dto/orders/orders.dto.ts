import {BaseEntityModel} from "../../../entity/base-entity-model";
import {IsEnum, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {EN_OrderStatusEnum} from "../../../enum/form/EN_OrderStatusEnum";
import {VALIDATION_MESSAGE_CONST} from "../../../const/validation-message.const";

export class OrdersDto extends BaseEntityModel {
    @IsNumber()
    carId:number;
    @IsEnum(EN_OrderStatusEnum)
    orderStatus: EN_OrderStatusEnum;
    carTitle:string;
    firstname:string;
    lastname:string
    phoneNumber:string;
    provinceId:number;
    cityId:number;
    @IsString({message:VALIDATION_MESSAGE_CONST.STRING_FORMAT.replace('var','توضیحات'),groups:['create']})
    content:string;
}
