import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {HelperService} from "../../core/service/helper.service";
import {CityEntity} from "../../entity/city/city.entity";
import {GalleryController} from "./gallery.controller";
import {GalleryService} from "./gallery.service";
import {UserModule} from "../user/user.module";
import {GalleryEntity} from "../../entity/gallery/gallery.entity";

@Module({
    controllers: [GalleryController],
    providers: [GalleryService,HelperService],
    imports: [
        UserModule,
        TypeOrmModule.forFeature([GalleryEntity]),
    ]
})
export class GalleryModule {}
