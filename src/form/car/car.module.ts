import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {HelperService} from "../../core/service/helper.service";
import {UserModule} from "../user/user.module";
import {CarService} from "./car.service";
import {CarController} from "./car.controller";
import {CarEntity} from "../../entity/car/car.entity";
import {ImageService} from "../../core/service/image.service";
import {HtmlProcessorService} from "../../core/service/html-processor.service";

@Module({
    controllers: [CarController],
    providers: [CarService,HelperService,ImageService ,HtmlProcessorService],
    imports: [
        UserModule,
        TypeOrmModule.forFeature([CarEntity]),
    ]
})
export class CarModule {}
