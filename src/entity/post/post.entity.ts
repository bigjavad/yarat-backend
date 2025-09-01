import {BeforeInsert,JoinColumn, ManyToOne, BeforeUpdate, Column, Entity, OneToMany} from "typeorm";
import {BasePopularModel} from "../../core/entity/base-popular-model";
import {CreatorSlug} from "../../core/utility/creator-slug";
import {UserEntity} from "../user/user.entity";
import {PostCommentEntity} from "./post-comment.entity";
import {EN_PostStatusEnum} from "../../core/enum/form/EN_PostStatus.enum";
import {CategoryMenuEntity} from "../category-menu/category-menu.entity";

@Entity("post")
export class PostEntity extends BasePopularModel{
    @Column({nullable: false})
    title: string;
    @Column({nullable: false})
    intro: string;
    @Column({ type: 'text', nullable: false })
    body: string;
    @Column({nullable: false})
    read: number;
    @Column({ unique: true })
    slug: string;
    @Column({ unique: true })
    image: string;
    @Column({
        type: 'enum',
        enum: EN_PostStatusEnum,
        nullable: false
    })
    postStatus: EN_PostStatusEnum;
    @BeforeInsert()
    @BeforeUpdate()
    generateSlug() {
        this.slug = CreatorSlug([this.title]);
    }
    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'creatorId',referencedColumnName: "id" })
    creator: UserEntity;

    @Column({ nullable: false })
    categoryMenuId: number;

    @ManyToOne(() => CategoryMenuEntity)
    @JoinColumn({ name: 'categoryMenuId',referencedColumnName: "id" })
    categoryMenu: CategoryMenuEntity;

    @OneToMany(() => PostCommentEntity, (PostCommentEntity) => PostCommentEntity.post)
    postComment: PostCommentEntity[];

}
