import { IsMobilePhone } from 'class-validator';

export class SendOtpDto {
    @IsMobilePhone('fa-IR')
    phoneNumber: string;
}
