import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {CityService} from "./city.service";
import {CityDto} from "../../core/model/dto/city/city.dto";
import {REST_CONST} from "../../core/const/rest.const";
import {ActionResult} from "../../core/model/base/action-result";
import {CityEntity} from "../../entity/city/city.entity";
import {JwtAuthGuard} from "../../jwt-auth.guard";
import {RoleGuard} from "../../core/guard/role.guard";
import {Role} from "../../core/decorator/role.decorator";
import {EN_RoleEnum} from "../../core/enum/form/EN_Role.enum";
import {GetRows} from "../../core/model/base/get-rows";
import {JsonInputDto} from "../../core/model/dto/json-input/json-input.dto";
import {CONTROLLER_CONST} from "../../core/const/controller.const";

@Controller(CONTROLLER_CONST.CITY)
export class CityController {
    constructor(private readonly cityService: CityService) {}
    @UseGuards(JwtAuthGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.SAVE)
    async save(@Body() cityDto:CityDto):Promise<ActionResult<CityEntity>>{
        return this.cityService.save(cityDto);
    }

    @UseGuards(JwtAuthGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.UPDATE)
    update(@Body() cityDto: CityDto): Promise<ActionResult<CityDto>> {
        return this.cityService.updateCity(cityDto);
    }

    @UseGuards(RoleGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.REMOVE)
    remove(@Body() id: number): Promise<ActionResult<CityEntity>> {
        return this.cityService.remove(id);
    }

    @UseGuards(RoleGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.GET_ROWS)
    getRows(@Body() getList: GetRows<CityDto, CityEntity[]>): Promise<ActionResult<GetRows<CityDto, CityEntity[]>>> {
        return this.cityService.getRowsCity(getList);
    }

    @Post(REST_CONST.CITY.GET_CITY_BY_ID)
    async getCityById(@Body() jsonInputDto:JsonInputDto):Promise<ActionResult<CityEntity[]>>{
        return this.cityService.getCityById(jsonInputDto.fieldId);
    }

}
