import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {ProvinceService} from "./province.service";
import {RoleGuard} from "../../core/guard/role.guard";
import {Role} from "../../core/decorator/role.decorator";
import {EN_RoleEnum} from "../../core/enum/form/EN_Role.enum";
import {REST_CONST} from "../../core/const/rest.const";
import {ActionResult} from "../../core/model/base/action-result";
import {ProvinceDto} from "../../core/model/dto/province/province.dto";
import {ProvinceEntity} from "../../entity/province/province.entity";
import {JwtAuthGuard} from "../../jwt-auth.guard";
import {GetRows} from "../../core/model/base/get-rows";
import {CONTROLLER_CONST} from "../../core/const/controller.const";

@Controller(CONTROLLER_CONST.PROVINCE)
export class ProvinceController {
    constructor(private readonly provinceService: ProvinceService) {}

    @UseGuards(JwtAuthGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.SAVE)
    save(@Body() provinceDto: ProvinceDto):Promise<ActionResult<ProvinceEntity>>{
        return this.provinceService.saveProvince(provinceDto)
    }

    @Get(REST_CONST.GLOBAL.GET_LIST)
    async getList():Promise<ActionResult<ProvinceEntity[]>>{
        return this.provinceService.getList();
    }

    @UseGuards(JwtAuthGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.UPDATE)
    update(@Body() provinceDto: ProvinceDto): Promise<ActionResult<ProvinceDto>> {
        return this.provinceService.updateProvince(provinceDto);
    }

    @UseGuards(RoleGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.REMOVE)
    remove(@Body() id: number): Promise<ActionResult<ProvinceEntity>> {
        return this.provinceService.remove(id);
    }

    @UseGuards(RoleGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.GET_ROWS)
    getRows(@Body() getList: GetRows<ProvinceDto, ProvinceEntity[]>): Promise<ActionResult<GetRows<ProvinceDto, ProvinceEntity[]>>> {
        return this.provinceService.getRowsProvince(getList);
    }


}
