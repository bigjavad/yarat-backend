import {HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {DataSource} from "typeorm";
import {Repository} from "typeorm";
import {HelperService} from "../../core/service/helper.service";
import {EN_Status} from "../../core/enum/base/EN_Status";
import {MessageConst} from "../../core/const/message.const";
import {sanitizeInput} from "../../core/utility/sanitize-input";
import {EN_ExceptionMessage} from "../../core/enum/base/EN_ExceptionMessage";
import {EN_ExceptionStatus} from "../../core/enum/base/EN_ExceptionStatus";
import {BaseService} from 'src/core/service/base.service';
import {PostEntity} from "../../entity/post/post.entity";
import {GetRows} from "../../core/model/base/get-rows";
import {PostDto} from "../../core/model/dto/post/post.dto";
import {ActionResult} from "../../core/model/base/action-result";
import {ImageService} from "../../core/service/image.service";
import {UploadPathConst} from "../../core/const/upload-path.const";
import {PropertyValueEntity} from "../../entity/property/property-value.entity";
import {PostCommentEntity} from "../../entity/post/post-comment.entity";
import {HtmlProcessorService} from "../../core/service/html-processor.service";
import {CategoryMenuEntity} from "../../entity/category-menu/category-menu.entity";

@Injectable()
export class PostService extends BaseService<PostEntity> {

    constructor(
        @InjectRepository(PostEntity)
        private readonly post_repository: Repository<PostEntity>,
        protected readonly helperService: HelperService,
        protected readonly imageService: ImageService,
        private readonly dataSource: DataSource,
        private readonly htmlProcessorService: HtmlProcessorService
    ) {
        super(post_repository, helperService);
    }

    async getRowsPost(
        getRows: GetRows<PostDto, PostEntity[]>
    ): Promise<ActionResult<GetRows<PostDto, PostEntity[]>>> {
        getRows.flattenView = [
            { path: 'categoryMenu.title', alias: 'categoryMenuTitle' },
            { path: 'postStatusValue.title', alias: 'postStatusTitle' },
        ];
        getRows.computed = [
            { name: 'commentCount', expression: 'COUNT(postComment.id)' },
        ];
        return this.helperService.actionResult(
            await super.getRows<PostDto>(
                getRows,
                (query, alias) => {
                    query
                        .innerJoin(`${alias}.categoryMenu` ,'categoryMenu')
                        .innerJoin(PropertyValueEntity, 'postStatusValue', `postStatusValue.serialNumber = ${alias}.postStatus`)
                        .leftJoin(PostCommentEntity, 'postComment', `postComment.postId = ${alias}.id`)
                        .addSelect([
                            'categoryMenu.title',
                            'categoryMenu.id',
                            'postStatusValue.title',
                        ])
                        .groupBy(`${alias}.id`)
                },
                'post'
            ),
            MessageConst.GLOBAL.GET_ROWS,
            false,
            EN_Status.success
        );
    }


    async savePost(postDto: PostDto): Promise<ActionResult<PostEntity>> {
        postDto.body = sanitizeInput(postDto.body);
        postDto.body = await this.htmlProcessorService.processHtmlImages(
            postDto.body,
            UploadPathConst.POST_CONTENT
        );
        postDto.image = await this.imageService.saveBase64Image(postDto.image, UploadPathConst.POST);
        const post = this.post_repository.create(postDto);
        return this.post_repository.save(post).then((res: PostEntity) => {
            return this.helperService.actionResult(res, MessageConst.GLOBAL.GET_ROWS, true, EN_Status.success);
        }).catch(() => {
            throw new HttpException(EN_ExceptionMessage.POST_EXISTS, EN_ExceptionStatus.BAD_REQUEST);
        })
    }

    async getBySlug(slug: string): Promise<ActionResult<PostEntity>> {
        const post = await this.post_repository
            .createQueryBuilder('post')
            .leftJoin('post.creator', 'creator')
            .leftJoinAndSelect('post.categoryMenu', 'categoryMenu')
            .leftJoinAndSelect('post.postComment', 'postComment')
            .where('post.slug = :slug', {slug})
            .addSelect([
                'creator.id',
                'creator.createdDate',
                'creator.email',
                'creator.firstname',
                'creator.image',
                'creator.lastname',
                'creator.slug',
            ])
            .getOne();
        return this.helperService.actionResult(post, MessageConst.GLOBAL.GET_ROWS, false, EN_Status.success);
    }

    async getCountWithStatus(postDto: PostDto) {
        const count = await this.post_repository.count({
            where: {
                postStatus: postDto.postStatus
            }
        })
        return this.helperService.actionResult<number>(count, MessageConst.GLOBAL.SUCCESS, false, EN_Status.success);
    }

    async remove(id: number): Promise<ActionResult<PostEntity>> {
        const post: PostEntity = await this.postStatus(id);
        await this.htmlProcessorService.deleteImagesFromHtml(post.body);
        if (post.image) {
            await this.imageService.deleteFile(post.image);
        }
        await super.remove(id);
        return this.helperService.actionResult<PostEntity>(post, MessageConst.GLOBAL.DELETE, true, EN_Status.success);
    }

    async updatePost(postDto: PostDto): Promise<ActionResult<PostDto>> {
        const post = await this.postStatus(postDto.id);
        const oldImages = await this.htmlProcessorService.extractImageUrls(post.body);
        const processingResult = await this.htmlProcessorService.processAndExtractImages(
            postDto.body,
            UploadPathConst.POST_CONTENT,
        );
        postDto.body = processingResult.processedHtml;
        await this.handleMainImageUpdate(postDto, post);
        const imagesToDelete = oldImages.filter(
            oldImage => !processingResult.imageUrls.includes(oldImage),
        );
        if (imagesToDelete.length > 0) {
            await this.imageService.deleteMultipleFiles(imagesToDelete);
        }
        const updatedPost = { ...post, ...postDto };
        const savedPost = await this.post_repository.save(updatedPost);
        return this.helperService.actionResult<PostDto>(
            savedPost,
            MessageConst.GLOBAL.UPDATE,
            true,
            EN_Status.success,
        );
    }


    private async handleMainImageUpdate(postDto: PostDto, existingPost: PostEntity): Promise<void> {
        const isNewImage = postDto.image && postDto.image !== existingPost.image;
        const isImageRemoved = !postDto.image && existingPost.image;
        if (isNewImage) {
            if (existingPost.image) {
                await this.imageService.deleteFile(existingPost.image);
            }
            postDto.image = await this.imageService.saveBase64Image(
                postDto.image,
                UploadPathConst.POST
            );
        } else if (isImageRemoved) {
            await this.imageService.deleteFile(existingPost.image);
            postDto.image = null;
        }
    }

    async postStatus(id: number): Promise<PostEntity> {
        const post: ActionResult<PostEntity> = await super.fineById(id);
        if (!post.data) {
            throw new HttpException(EN_ExceptionMessage.NOT_FOUND, EN_ExceptionStatus.NOT_FOUND);
        }
        return post.data;
    }

}
