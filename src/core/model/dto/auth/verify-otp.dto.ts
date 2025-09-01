import { IsMobilePhone, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
    @IsMobilePhone('fa-IR')
    phoneNumber: string;

    @IsString()
    @Length(6, 6)
    code: string;
}
