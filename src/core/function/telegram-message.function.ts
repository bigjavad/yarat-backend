import {LoginDto} from "../model/dto/auth/login.dto";

export function sendTelegramMessageLogin(loginDto: LoginDto) {
    return `👤 کاربر جدید وارد سیستم شد:
    📌 اطلاعات ورود:
   ▫️ موبایل: ${loginDto.phoneNumber || 'ثبت نشده'}
    👤 اطلاعات کاربری:
    ▫️ نام کامل:${loginDto.firstname+" "+loginDto.lastname || 'ثبت نشده'}
    ⏰ زمان ورود:${loginDto.createdDate}
    `
}
