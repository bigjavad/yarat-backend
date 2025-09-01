import {EntitySubscriberInterface, EventSubscriber, LoadEvent} from 'typeorm';
import {PostCommentEntity} from './post-comment.entity';
import {EN_CommentStatusEnum} from '../../core/enum/form/EN_CommentStatus.enum';

@EventSubscriber()
export class PostCommentSubscriber implements EntitySubscriberInterface<PostCommentEntity> {
    listenTo() {
        return PostCommentEntity;
    }

    async afterLoad(comment: PostCommentEntity, event: LoadEvent<PostCommentEntity>) {
        comment.hasReplies = await event.manager
            .createQueryBuilder(PostCommentEntity, 'reply')
            .where('reply.parentCommentId = :commentId', {commentId: comment.id})
            .andWhere('reply.status = :status', {
                status: EN_CommentStatusEnum.UNDER_REVIEW
            })
            .getExists();
    }
}
