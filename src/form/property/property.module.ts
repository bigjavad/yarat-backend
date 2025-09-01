import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {HelperService} from "../../core/service/helper.service";
import {PropertyService} from "./property.service";
import {PropertyController} from "./property.controller";
import {PropertyEntity} from "../../entity/property/property.entity";
import {PropertyValueModule} from "./property-value/property-value.module";
import {UserModule} from "../user/user.module";

@Module({
    controllers: [PropertyController],
    providers: [PropertyService,HelperService],
    imports: [
        UserModule,
        TypeOrmModule.forFeature([PropertyEntity]),
    ],
})
export class PropertyModule {
}
