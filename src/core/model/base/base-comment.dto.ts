import {BasePopularModel} from "../../entity/base-popular-model";
import {EN_CommentStatusEnum} from "../../enum/form/EN_CommentStatus.enum";

export class BaseCommentDto extends BasePopularModel{
    title:string;
    content:string;
    status:EN_CommentStatusEnum;
}
