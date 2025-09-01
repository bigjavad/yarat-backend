import {BaseEntityModel} from "../../../entity/base-entity-model";
import {EN_RoleEnum} from "../../../enum/form/EN_Role.enum";

export class LoginDto extends BaseEntityModel{
    phoneNumber:string;
    password:string;
    token:string;
    fullName:string;
    code:string;
    firstname:string;
    lastname:string;
    role: EN_RoleEnum;
    provinceId: number;
    cityId: number;
}
