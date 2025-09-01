import {Injectable} from '@nestjs/common';
import {PostCommentEntity} from "../../../entity/post/post-comment.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

import {MessageConst} from "../../../core/const/message.const";
import {EN_Status} from "../../../core/enum/base/EN_Status";
import {BaseService} from "../../../core/service/base.service";
import {HelperService} from "../../../core/service/helper.service";
import {ActionResult} from "../../../core/model/base/action-result";
import {TreeRepository} from 'typeorm';
import {EN_CommentStatusEnum} from "../../../core/enum/form/EN_CommentStatus.enum";
import {PostCommentDto} from "../../../core/model/dto/post/post-comment.dto";

@Injectable()
export class PostCommentService extends BaseService<PostCommentEntity> {
    constructor(
        @InjectRepository(PostCommentEntity)
        private readonly comment_repository: Repository<PostCommentEntity>,
        protected readonly helperService: HelperService,
        @InjectRepository(PostCommentEntity)
        private readonly comment_tree_repository: TreeRepository<PostCommentEntity>,
    ) {
        super(comment_repository, helperService)
    }

    async replyComment(replyDto: PostCommentDto): Promise<ActionResult<PostCommentEntity>> {
        const parentComment = await this.comment_repository.findOneOrFail({
            where: {id: replyDto.parentCommentId}
        });
        const reply = this.comment_repository.create({
            ...replyDto,
            postId: parentComment.postId,
            parentComment: parentComment
        });
        return this.helperService.actionResult(await this.comment_repository.save(reply), MessageConst.POST_COMMENT.REPLY_COMMENT, false, EN_Status.success);
    }

    async getCommentReplies(commentDto: PostCommentDto): Promise<ActionResult<PostCommentEntity[]>> {
        const comment = await this.comment_tree_repository.find({
            where: {
                parentCommentId: commentDto.id,
                postId: commentDto.postId,
                status: EN_CommentStatusEnum.ENABLE
            },
            relations: ['user']
        });
        return this.helperService.actionResult(comment, MessageConst.GLOBAL.SUCCESS, false, EN_Status.success);
    }

    async createComment(createDto: PostCommentDto): Promise<ActionResult<PostCommentEntity>> {
        const comment = this.comment_repository.create({
            ...createDto,
            status: EN_CommentStatusEnum.ENABLE
        });
        return this.helperService.actionResult(
            await this.comment_repository.save(comment),
            MessageConst.GLOBAL.SAVE,
            false,
            EN_Status.success
        );
    }


    async getAllParentComments(): Promise<ActionResult<PostCommentEntity[]>> {
        const comments = await this.comment_tree_repository.find({
            where: {
                parentCommentId: null,
                status: EN_CommentStatusEnum.UNDER_REVIEW
            },
            relations: ['user'],
            order: {createdDate: 'DESC'}
        });

        return this.helperService.actionResult(
            comments,
            MessageConst.POST_COMMENT.ALL_PARENT_COMMENTS,
            false,
            EN_Status.success
        );
    }


}
