import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {HelperService} from "../../../core/service/helper.service";
import {UserModule} from "../../user/user.module";
import {CarBodyColorService} from "./car-body-color.service";
import {CarBodyColorEntity} from "../../../entity/car/car-body-color.entity";
import {CarBodyColorController} from "./car-body-color.controller";

@Module({
    controllers: [CarBodyColorController],
    providers: [CarBodyColorService,HelperService],
    imports: [
        UserModule,
        TypeOrmModule.forFeature([CarBodyColorEntity]),
    ]
})
export class CarBodyColorModule {}
