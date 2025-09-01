import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {HelperService} from "../../core/service/helper.service";
import {CityEntity} from "../../entity/city/city.entity";
import {CityController} from "./city.controller";
import {CityService} from "./city.service";
import {UserModule} from "../user/user.module";

@Module({
    controllers: [CityController],
    providers: [CityService,HelperService],
    imports: [
        UserModule,
        TypeOrmModule.forFeature([CityEntity]),
    ]
})
export class CityModule {}
