import {Controller, Post, Body, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {REST_CONST} from "../../core/const/rest.const";
import {ActionResult} from "../../core/model/base/action-result";
import {LoginDto} from "../../core/model/dto/auth/login.dto";
import {RoleGuard} from "../../core/guard/role.guard";
import {UserDto} from "../../core/model/dto/user/user.dto";
import {CONTROLLER_CONST} from "../../core/const/controller.const";

@Controller(CONTROLLER_CONST.AUTH)
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post(REST_CONST.AUTH.LOGIN)
    login(@Body() loginDto: LoginDto):Promise<ActionResult<LoginDto>> {
        return this.authService.login(loginDto);
    }

    @Post(REST_CONST.AUTH.VERIFY)
    verify(@Body() loginDto: LoginDto):Promise<ActionResult<LoginDto>> {
        return this.authService.verify(loginDto);
    }

    @Post(REST_CONST.AUTH.CHANGE_PASSWORD)
    changePassword(@Body() loginDto: LoginDto):Promise<ActionResult<UserDto>> {
        return this.authService.changePassword(loginDto);
    }

    @Post(REST_CONST.AUTH.SIGN_IN)
    signIn(@Body() loginDto: LoginDto):Promise<ActionResult<LoginDto>> {
        return this.authService.signIn(loginDto);
    }

    @UseGuards(RoleGuard)
    @Post(REST_CONST.AUTH.SIGN_IN_WITH_TOKEN)
    signInWithToken(@Body() userDto:UserDto):Promise<ActionResult<UserDto>>{
        return this.authService.signInWithToken(userDto);
    }

}
