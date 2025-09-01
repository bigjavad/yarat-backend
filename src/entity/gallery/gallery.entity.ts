import {Column, Entity} from "typeorm";
import {BaseEntityModel} from "../../core/entity/base-entity-model";
import {EN_GalleryTypeEnum} from "../../core/enum/form/EN_GalleryType.enum";

@Entity("gallery")
export class GalleryEntity extends BaseEntityModel{
    @Column({nullable: false})
    title:string;
    @Column({nullable: true})
    description:string;
    @Column({nullable: false})
    slug:string;
    @Column({ type: 'enum', enum: EN_GalleryTypeEnum })
    galleryType:EN_GalleryTypeEnum;
    @Column({nullable: false})
    file:string;
}
