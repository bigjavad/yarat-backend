import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {PostCommentService} from './post-comment.service';
import {RoleGuard} from "../../../core/guard/role.guard";
import {Role} from "../../../core/decorator/role.decorator";
import {EN_RoleEnum} from "../../../core/enum/form/EN_Role.enum";
import {REST_CONST} from "../../../core/const/rest.const";
import {ActionResult} from "../../../core/model/base/action-result";
import {PostCommentDto} from "../../../core/model/dto/post/post-comment.dto";
import {PostCommentEntity} from "../../../entity/post/post-comment.entity";
import {CONTROLLER_CONST} from "../../../core/const/controller.const";

@Controller(CONTROLLER_CONST.POST_COMMENT)
export class PostCommentController {
    constructor(private readonly postCommentService: PostCommentService) {}

    @UseGuards(RoleGuard)
    @Role(EN_RoleEnum.ADMIN, EN_RoleEnum.USER)
    @Post(REST_CONST.GLOBAL.SAVE)
    save(@Body() postCommentDto: PostCommentDto): Promise<ActionResult<PostCommentEntity>> {
        if (postCommentDto.parentCommentId) return this.postCommentService.replyComment(postCommentDto);
         else return this.postCommentService.createComment(postCommentDto);
    }

    @Post(REST_CONST.POST_COMMENT.GET_COMMENT_REPLIES)
    getCommentReplies(@Body() postCommentDto: PostCommentDto): Promise<ActionResult<PostCommentEntity[]>> {
        return this.postCommentService.getCommentReplies(postCommentDto)
    }

    @Get(REST_CONST.POST_COMMENT.GET_ALL_PARENT_COMMENTS)
    getAllParentComments(): Promise<ActionResult<PostCommentEntity[]>> {
        return this.postCommentService.getAllParentComments()
    }


}
