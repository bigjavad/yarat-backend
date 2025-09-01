import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {HelperService} from "../../core/service/helper.service";
import {UserEntity} from "../../entity/user/user.entity";
import {ImageService} from "../../core/service/image.service";
import {TelegramService} from "../../external/telegram/telegram.service";

@Module({
    controllers: [UserController],
    providers: [UserService,HelperService,ImageService,TelegramService],
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
    ],
    exports: [UserService,HelperService,ImageService,TelegramService],
})
export class UserModule {
}
