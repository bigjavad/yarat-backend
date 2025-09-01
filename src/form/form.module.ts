import { Module } from '@nestjs/common';
import {UserModule} from "./user/user.module";
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import {PostCommentModule} from "./post/post-comment/post-comment.module";
import { LoggerModule } from './logger/logger.module';
import {CategoryMenuModule} from "./category-menu/category-menu.module";
import {ProvinceModule} from "./province/province.module";
import {CityModule} from "./city/city.module";
import {PropertyModule} from "./property/property.module";
import {PropertyValueModule} from "./property/property-value/property-value.module";
import {UploadModule} from "./upload/upload.module";
import {CarBodyColorModule} from "./car/car-body-color/car-body-color.module";
import {CarModule} from "./car/car.module";
import {VarBaseModule} from "./var-base/var-base.module";
import {GalleryModule} from "./gallery/gallery.module";
import {OrdersModule} from "./orders/orders.module";

@Module({
    imports:[UserModule,GalleryModule,VarBaseModule,CarModule,UploadModule,
        CarBodyColorModule,CityModule, AuthModule,ProvinceModule, PostModule,
        PostCommentModule, CategoryMenuModule, LoggerModule,PropertyModule,
        OrdersModule,PropertyValueModule]
})
export class FormModule {}
