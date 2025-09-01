import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {CONTROLLER_CONST} from "../../../core/const/controller.const";
import {CarBodyColorService} from "./car-body-color.service";
import {JwtAuthGuard} from "../../../jwt-auth.guard";
import {Role} from "../../../core/decorator/role.decorator";
import {EN_RoleEnum} from "../../../core/enum/form/EN_Role.enum";
import {REST_CONST} from "../../../core/const/rest.const";
import {ActionResult} from "../../../core/model/base/action-result";
import {RoleGuard} from "../../../core/guard/role.guard";
import {GetRows} from "../../../core/model/base/get-rows";
import {CarBodyColorEntity} from "../../../entity/car/car-body-color.entity";
import {CarBodyColorDto} from "../../../core/model/dto/car/car-body-color.dto";

@Controller(CONTROLLER_CONST.CAR_BODY_COLOR)
export class CarBodyColorController {
    constructor(private readonly carBodyColorService: CarBodyColorService) {}

    @UseGuards(JwtAuthGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.SAVE)
    save(@Body() carBodyColorDto: CarBodyColorDto):Promise<ActionResult<CarBodyColorEntity>>{
        return this.carBodyColorService.saveCarBodyColor(carBodyColorDto)
    }

    @UseGuards(JwtAuthGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.UPDATE)
    update(@Body() carBodyColorDto: CarBodyColorDto): Promise<ActionResult<CarBodyColorDto>> {
        return this.carBodyColorService.updateCarBodyColor(carBodyColorDto);
    }

    @UseGuards(RoleGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.REMOVE)
    remove(@Body() id: number): Promise<ActionResult<CarBodyColorEntity>> {
        return this.carBodyColorService.remove(id);
    }

    @UseGuards(RoleGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.GET_ROWS)
    getRows(@Body() getList: GetRows<CarBodyColorDto, CarBodyColorEntity[]>): Promise<ActionResult<GetRows<CarBodyColorDto, CarBodyColorEntity[]>>> {
        return this.carBodyColorService.getRowsCarBodyColor(getList);
    }

    @Get(REST_CONST.GLOBAL.GET_LIST)
    async getList():Promise<ActionResult<CarBodyColorEntity[]>>{
        return this.carBodyColorService.getList();
    }

}
