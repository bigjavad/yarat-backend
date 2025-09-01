import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {UserService} from "../user/user.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {HelperService} from "../../core/service/helper.service";
import {UserEntity} from "../../entity/user/user.entity";
import {ImageService} from "../../core/service/image.service";
import {SmsService} from "../../external/sms/sms.service";
import {TelegramService} from "../../external/telegram/telegram.service";
import {SmsModule} from "../../external/sms/sms.module";

@Module({
    controllers: [AuthController],
    providers: [AuthService, UserService,HelperService,ImageService,SmsService,TelegramService],
    imports: [
        SmsModule,
        JwtModule.register({
            secret: "secret",
            signOptions: {expiresIn: "1d"}
        }),
        TypeOrmModule.forFeature([UserEntity]),
    ],


})
export class AuthModule {}
