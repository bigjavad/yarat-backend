import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {REST_CONST} from "../../core/const/rest.const";
import {UserService} from "./user.service";
import {JwtAuthGuard} from "../../jwt-auth.guard";
import {Role} from "../../core/decorator/role.decorator";
import {EN_RoleEnum} from "../../core/enum/form/EN_Role.enum";
import {RoleGuard} from "../../core/guard/role.guard";
import {UserDto} from "../../core/model/dto/user/user.dto";
import {ActionResult} from "../../core/model/base/action-result";
import {GetRows} from "../../core/model/base/get-rows";
import {UserEntity} from "../../entity/user/user.entity";
import {UserCountRoleDto} from "../../core/model/dto/user/user-count-role.dto";
import {CONTROLLER_CONST} from "../../core/const/controller.const";


@Controller(CONTROLLER_CONST.USER)
export class UserController {

    constructor(private readonly usersService: UserService) {
    }


    @UseGuards(RoleGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.USER.FIND_ROLE_USER_BY_MOBILE)
    findRoleUserByMobile(@Body() userDto: UserDto): Promise<ActionResult<UserDto>> {
        return this.usersService.findRoleUserByMobile(userDto);
    }

    @UseGuards(RoleGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.SAVE)
    save(@Body() createUserDto: UserDto): Promise<ActionResult<UserDto>> {
        return this.usersService.saveUser(createUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.UPDATE)
    update(@Body() updateUserDto: UserDto): Promise<ActionResult<UserDto>> {
        return this.usersService.updateUser(updateUserDto);
    }

    // @UseGuards(AuthGuard('jwt'))
    // getProfile(@Request() req)
    @UseGuards(RoleGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.REMOVE)
    remove(@Body() id: number): Promise<ActionResult<UserEntity>> {
        return this.usersService.remove(id);
    }

    @UseGuards(RoleGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.GET_ROWS)
    getRows(@Body() getList: GetRows<UserDto, UserEntity[]>): Promise<ActionResult<GetRows<UserDto, UserEntity[]>>> {
        return this.usersService.getRowsUsers(getList);
    }

    @UseGuards(RoleGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.USER.USER_COUNT_ROLE)
    UserCountRole(@Body() userCountRoleDto:UserCountRoleDto): Promise<ActionResult<UserCountRoleDto>>{
        return this.usersService.getUserCountRole(userCountRoleDto);
    }

}
