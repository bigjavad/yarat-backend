import {BaseEntityModel} from "../../../entity/base-entity-model";
import {EN_PostStatusEnum} from "../../../enum/form/EN_PostStatus.enum";

export class PostDto extends BaseEntityModel{
    title: string;
    intro: string;
    body: string;
    read: number;
    slug: string;
    commentCount: number;
    image:string;
    categoryMenuSubsetId:number;
    postStatus:EN_PostStatusEnum;
}
