import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    Tree,
    TreeChildren,
    TreeParent
} from "typeorm";
import {PostEntity} from "./post.entity";
import {BasePopularModel} from "../../core/entity/base-popular-model";
import {CreatorSlug} from "../../core/utility/creator-slug";
import {EN_CommentStatusEnum} from "../../core/enum/form/EN_CommentStatus.enum";
import {UserEntity} from "../user/user.entity";
import {Connection} from "mysql2";
import {InjectConnection} from "@nestjs/typeorm";

@Entity("post-comment")
@Tree("nested-set")
export class PostCommentEntity extends BasePopularModel {
    constructor(
        @InjectConnection()
        private readonly connection: Connection
    ) {
        super();
    }

    @Column({nullable: false})
    postId: number;

    @Column({nullable: false})
    title: string;

    @Column({nullable: false, type: 'text'})
    description: string;

    @Column({
        nullable: false,
        default: EN_CommentStatusEnum.UNDER_REVIEW,
        type: 'enum',
        enum: EN_CommentStatusEnum
    })
    status: EN_CommentStatusEnum;

    @Column({unique: true})
    slug: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({name: 'creatorId', referencedColumnName: "id"})
    user: UserEntity;

    @TreeChildren()
    replies: PostCommentEntity[];

    @TreeParent()
    parentComment: PostCommentEntity;

    @Column({nullable: true})
    parentCommentId: number;

    @BeforeInsert()
    @BeforeUpdate()
    generateSlug() {
        this.slug = CreatorSlug([this.title]);
    }

    @ManyToOne(() => PostEntity, (post) => post.postComment, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'postId', referencedColumnName: "id"})
    post: PostEntity;

    hasReplies?: boolean;

}
