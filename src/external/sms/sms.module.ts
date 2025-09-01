import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserOtpEntity} from "../../entity/user/user-otp.entity";

@Module({
    providers: [SmsService],
    exports: [SmsService,
        TypeOrmModule.forFeature([UserOtpEntity]),
    ],
    imports:[
        TypeOrmModule.forFeature([UserOtpEntity]),
    ]
})
export class SmsModule {}
