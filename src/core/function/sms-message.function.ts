import {LoginDto} from "../model/dto/auth/login.dto";
import {UserDto} from "../model/dto/user/user.dto";


export function sendOtpMessage(otp: string) {
    return `        یارات جهت ورود کد زیر را وارد کنید
        ${otp}`
}

export function sendWelcomeUserMessage(loginDto: LoginDto) {
    return `${loginDto.fullName} به سامانه یارات خوش آمدید. `
}

export function sendSaveRequestOrder(userDto: UserDto) {
    return `سامانه یارات
کاربر گرامی ${userDto.fullName} درخواست شما با موفقیت ثبت شد کارشناسان ما به زودی با شما تماس خواهد گرفت.`
}
