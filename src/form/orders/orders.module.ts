import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {HelperService} from "../../core/service/helper.service";
import {UserModule} from "../user/user.module";
import {OrdersController} from "./orders.controller";
import {OrdersService} from "./orders.service";
import {OrdersEntity} from "../../entity/orders/orders.entity";
import {SmsModule} from "../../external/sms/sms.module";

@Module({
    controllers: [OrdersController],
    providers: [OrdersService, HelperService],
    imports: [
        UserModule,
        SmsModule,
        TypeOrmModule.forFeature([OrdersEntity]),
    ],
})
export class OrdersModule {
}
