import { Injectable, HttpException } from '@nestjs/common';
import { smsConfig } from './sms.config';
import {UserOtpEntity} from "../../entity/user/user-otp.entity";
import {Repository , MoreThan} from "typeorm";
import {InjectRepository } from "@nestjs/typeorm";
import {sendOtpMessage} from "../../core/function/sms-message.function";
import {SmsPayloadDto} from "../../core/model/dto/sms/sms-payload.dto";
import {UserOtpDto} from "../../core/model/dto/user/user-otp.dto";

@Injectable()
export class SmsService {

    constructor(
        @InjectRepository(UserOtpEntity)
        private user_otp_repository: Repository<UserOtpEntity>,
    ) {
    }

    async sendOtp(phoneNumber: string): Promise<boolean> {
        const otpCode = this.generateOtp();
        let payload:SmsPayloadDto = new SmsPayloadDto();
        payload.to = phoneNumber;
        payload.text = sendOtpMessage(otpCode);
        let modelOtp:UserOtpDto=new UserOtpDto();
        modelOtp.phoneNumber = phoneNumber;
        modelOtp.code = otpCode;
        const otp:UserOtpEntity = this.user_otp_repository.create(modelOtp);
        await this.user_otp_repository.save(otp)
        return this.request(payload);
    }

    sendMessage(phoneNumber:string, text:string){
        let payload:SmsPayloadDto= new SmsPayloadDto();
        payload.to = phoneNumber;
        payload.text =  text;
        return this.request(payload);
    }

    async request(payload):Promise<boolean> {
        try {
            const res = await fetch(smsConfig.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (data.Value < 0) {
                throw new Error(data.Message);
            }
            return true;
        } catch (err) {
            throw new HttpException(`خطا در ارسال پیامک: ${err.message}`, 500,);
        }
    }

    async verify(phoneNumber: string, code: string): Promise<boolean> {
        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
        const otp = await this.user_otp_repository.findOne({
            where: {
                phoneNumber:phoneNumber,
                code:code,
                isUsed: false,
                createdDate: MoreThan(twoMinutesAgo)
            }
        });
        if (!otp) return false;
        otp.isUsed = true;
        await this.user_otp_repository.save(otp);
        return true;
    }

    private generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}
