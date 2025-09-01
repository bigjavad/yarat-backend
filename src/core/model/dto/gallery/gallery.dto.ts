import {BaseEntityModel} from "../../../entity/base-entity-model";
import {EN_GalleryTypeEnum} from "../../../enum/form/EN_GalleryType.enum";
import {IsEnum, IsNotEmpty, IsString} from "class-validator";

export class GalleryDto extends BaseEntityModel {
    @IsString()
    @IsNotEmpty()
    title:string;
    @IsString()
    @IsNotEmpty()
    slug:string;
    @IsString()
    description:string;
    @IsString()
    @IsNotEmpty()
    file:string;
    @IsEnum(EN_GalleryTypeEnum)
    @IsNotEmpty()
    galleryType:EN_GalleryTypeEnum;
}
