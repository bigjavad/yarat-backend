import {Module} from '@nestjs/common';
import {PostService} from './post.service';
import {PostController} from './post.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {HelperService} from "../../core/service/helper.service";
import {PostEntity} from "../../entity/post/post.entity";
import {UserEntity} from "../../entity/user/user.entity";
import {UserModule} from "../user/user.module";
import {ImageService} from "../../core/service/image.service";
import {HtmlProcessorService} from "../../core/service/html-processor.service";
import {CategoryMenuEntity} from "../../entity/category-menu/category-menu.entity";

@Module({
    controllers: [PostController],
    providers: [PostService, HelperService,ImageService,HtmlProcessorService],
    imports: [
        UserModule,
        TypeOrmModule.forFeature([PostEntity, UserEntity, CategoryMenuEntity]),
    ],
})
export class PostModule {
}
