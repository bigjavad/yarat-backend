import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {PropertyValueEntity} from "../../../entity/property/property-value.entity";
import {PropertyValueService} from "./property-value.service";
import {PropertyValueController} from "./property-value.controller";
import {HelperService} from "../../../core/service/helper.service";
import {UserService} from "../../user/user.service";
import {UserModule} from "../../user/user.module";

@Module({
    controllers: [PropertyValueController],
    providers: [PropertyValueService,HelperService],
    imports: [
        UserModule,
        TypeOrmModule.forFeature([PropertyValueEntity]),
    ],
})
export class PropertyValueModule {
}
