import {BaseEntityModel} from "../../../entity/base-entity-model";
import {EN_RoleEnum} from "../../../enum/form/EN_Role.enum";
import { IsEnum, IsNotEmpty, IsString} from "class-validator";


export class UserDto extends BaseEntityModel{
    fullName:string;
    @IsString()
    phoneNumber:string;
    @IsString()
    token:string;
    @IsEnum(EN_RoleEnum)
    role: EN_RoleEnum;
    @IsString()
    password: string;
    @IsString()
    @IsNotEmpty()
    firstname: string;
    @IsString()
    @IsNotEmpty()
    lastname: string;
    @IsString()
    @IsNotEmpty()
    cityId: number;
    @IsString()
    @IsNotEmpty()
    provinceId: number;

    cityTitle?: string;
    provinceTitle?: string;
}
