import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {HelperService} from "../../core/service/helper.service";
import {ProvinceEntity} from "../../entity/province/province.entity";
import {ProvinceController} from "./province.controller";
import {ProvinceService} from "./province.service";
import {UserModule} from "../user/user.module";
import {ImageService} from "../../core/service/image.service";

@Module({
    controllers: [ProvinceController],
    providers: [ProvinceService, HelperService,ImageService],
    imports: [
        UserModule,
        TypeOrmModule.forFeature([ProvinceEntity]),
    ],
})
export class ProvinceModule {
}
