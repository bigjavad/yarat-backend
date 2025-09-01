import {Module} from '@nestjs/common';
import {PostCommentService} from './post-comment.service';
import {PostCommentController} from './post-comment.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {PostCommentEntity} from "../../../entity/post/post-comment.entity";
import {PostEntity} from "../../../entity/post/post.entity";
import {HelperService} from "../../../core/service/helper.service";
import {UserModule} from "../../user/user.module";

@Module({
    controllers: [PostCommentController],
    providers: [PostCommentService,HelperService],
    imports: [
        UserModule,
        TypeOrmModule.forFeature([
            PostCommentEntity,
            PostEntity,
        ])
    ],
})
export class PostCommentModule {
}
