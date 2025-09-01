import {HttpException, Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import * as bcrypt from 'bcryptjs';
import {EN_ExceptionMessage} from "../../core/enum/base/EN_ExceptionMessage";
import {EN_ExceptionStatus} from "../../core/enum/base/EN_ExceptionStatus";
import {JwtService} from "@nestjs/jwt";
import {HelperService} from "../../core/service/helper.service";
import {EN_Status} from "../../core/enum/base/EN_Status";
import {MessageConst} from "../../core/const/message.const";
import {EN_RoleEnum} from "../../core/enum/form/EN_Role.enum";
import {ActionResult} from "../../core/model/base/action-result";
import {UserEntity} from "../../entity/user/user.entity";
import {LoginDto} from "../../core/model/dto/auth/login.dto";
import {SmsService} from "../../external/sms/sms.service";
import {TelegramService} from "../../external/telegram/telegram.service";
import {sendTelegramMessageLogin} from "../../core/function/telegram-message.function";
import {sendWelcomeUserMessage} from "../../core/function/sms-message.function";
import {UserDto} from "../../core/model/dto/user/user.dto";
import * as jwt from "jsonwebtoken";

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly helperService: HelperService,
        private readonly smsService: SmsService,
        private readonly telegramService: TelegramService
    ) {
    }

    async login(loginDto: LoginDto): Promise<ActionResult<LoginDto>> {
        const user = await this.userService.findUserByMobile(loginDto.phoneNumber);
        if (!user) {
            loginDto.role = EN_RoleEnum.USER;
            const createUserDto: UserEntity = await this.userService.save(loginDto);
            loginDto = this.helperService.mapper<UserEntity, LoginDto>(createUserDto, loginDto);
            loginDto.token = await this.creatorJwt(createUserDto.id);
            await this.sendOtp(loginDto);
        }
        if (user.password && loginDto.password) {
            const isPasswordCorrect = await bcrypt.compare(loginDto.password, user.password);
            if (!isPasswordCorrect) {
                throw new HttpException(EN_ExceptionMessage.AUTH_INCORRECT_PASSWORD, EN_ExceptionStatus.BAD_REQUEST);
            }
            loginDto.password = null;
            loginDto.token = await this.creatorJwt(user.id);
            loginDto.fullName = this.helperService.creatorFullName([user.firstname, user.lastname]);
            return this.helperService.actionResult<LoginDto>(loginDto, MessageConst.AUTH.LOGIN, true, EN_Status.success);
        } else return await this.sendOtp(loginDto);
    }

    async sendOtp(loginDto: LoginDto): Promise<ActionResult<LoginDto>> {
        await this.smsService.sendOtp(loginDto.phoneNumber);
        return this.helperService.actionResult(null, MessageConst.AUTH.VERIFY, true, EN_Status.success);
    }

    async verify(loginDto: LoginDto, hasMessage: boolean = true): Promise<ActionResult<LoginDto>> {
        const verifyOtp = await this.smsService.verify(loginDto.phoneNumber, loginDto.code);
        if (verifyOtp) {
            const user = await this.userService.findUserByMobile(loginDto.phoneNumber);
            loginDto = this.helperService.mapper<UserEntity, LoginDto>(user, loginDto);
            loginDto.fullName = this.helperService.creatorFullName([loginDto.firstname, loginDto.lastname]);
            loginDto.token = await this.creatorJwt(loginDto.id);
            if (hasMessage) {
                await this.smsService.sendMessage(loginDto.phoneNumber, sendWelcomeUserMessage(loginDto));
                await this.telegramService.sendMessage(sendTelegramMessageLogin(loginDto));
            }
        } else {
            throw new HttpException(EN_ExceptionMessage.AUTH_EXPIRE_CODE, EN_ExceptionStatus.BAD_REQUEST);
        }
        return this.helperService.actionResult(loginDto, MessageConst.AUTH.LOGIN, true, EN_Status.success);
    }

    async creatorJwt(id: number): Promise<string> {
        return this.jwtService.sign({sub: id});
    }

    async signIn(loginDto: LoginDto): Promise<ActionResult<LoginDto>> {
        const user: UserEntity = await this.userService.findUserByMobile(loginDto.phoneNumber);
        if (!user) {
            throw new HttpException(EN_ExceptionMessage.AUTH_NOT_FIND_USER_BY_MOBILE, EN_ExceptionStatus.NOT_FOUND);
        } else if (user.role === EN_RoleEnum.USER) {
            throw new HttpException(EN_ExceptionMessage.AUTH_NOT_ALLOWED_CALL_SERVICE, EN_ExceptionStatus.BAD_REQUEST);
        } else {
            if (loginDto.password) {
                if (!user.password) {
                    throw new HttpException(EN_ExceptionMessage.AUTH_INCORRECT_PASSWORD, EN_ExceptionStatus.BAD_REQUEST);
                }
                const isPasswordMath = await bcrypt.compare(loginDto.password, user.password);
                if (!isPasswordMath) {
                    throw new HttpException(EN_ExceptionMessage.AUTH_INCORRECT_PASSWORD, EN_ExceptionStatus.BAD_REQUEST);
                }
                loginDto = this.helperService.mapper<UserEntity , LoginDto>(user,loginDto);
                loginDto.password = await bcrypt.hash(loginDto.password, 10);
                loginDto.token = await this.creatorJwt(user.id);
                loginDto.fullName = this.helperService.creatorFullName([user?.firstname, user?.lastname]);
                return this.helperService.actionResult<LoginDto>(loginDto, MessageConst.AUTH.LOGIN, true, EN_Status.success);
            } else return await this.sendOtp(loginDto);
        }
    }

    async changePassword(loginDto: LoginDto): Promise<ActionResult<UserDto>> {
        const password:string = loginDto.password;
        const verify:LoginDto = (await this.verify(loginDto, false)).data;
        const user:UserEntity = (await this.userService.fineById(verify.id)).data;
        user.password = password;
        const userDto = this.helperService.mapper<UserEntity, UserDto>(user, new UserDto());
        await this.userService.updateUser(userDto);
        userDto.token = await this.creatorJwt(user.id);
        return this.helperService.actionResult<UserDto>(userDto, MessageConst.AUTH.CHANGE_PASSWORD, false, EN_Status.success);
    }

    async signInWithToken(userDto: UserDto): Promise<ActionResult<UserDto>> {
        const decoded = jwt.verify(userDto.token, 'secret') as { sub: any };
        const userId = Number(decoded.sub);
        const user: UserDto = this.helperService.mapper<UserEntity, UserDto>((await this.userService.fineById(userId)).data, userDto);
        user.token = await this.creatorJwt(userDto.id);
        user.fullName = this.helperService.creatorFullName([user?.firstname, user?.lastname]);
        return this.helperService.actionResult<UserDto>(user, MessageConst.GLOBAL.SUCCESS, false, EN_Status.success);
    }

}
