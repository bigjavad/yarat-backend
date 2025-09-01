import {BasePopularModel} from "../../../entity/base-popular-model";
import {EN_CategoryStatusEnum} from "../../../enum/form/EN_CategoryStatus.enum";
import {IsEnum, IsNotEmpty, IsString} from "class-validator";

export class CategoryMenuDto extends BasePopularModel{
    @IsNotEmpty()
    @IsString()
    title:string;
    @IsNotEmpty()
    @IsString()
    link:string;
    @IsString()
    slug:string;
    @IsString()
    icon: string;
    @IsString()
    image: string;
    @IsString()
    color: string;
    @IsNotEmpty()
    @IsEnum(EN_CategoryStatusEnum)
    categoryStatus: EN_CategoryStatusEnum;
}
