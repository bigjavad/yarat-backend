import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import {CONTROLLER_CONST} from "../../core/const/controller.const";
import {CarService} from "./car.service";
import {RoleGuard} from "../../core/guard/role.guard";
import {Role} from "../../core/decorator/role.decorator";
import {EN_RoleEnum} from "../../core/enum/form/EN_Role.enum";
import {REST_CONST} from "../../core/const/rest.const";
import {ActionResult} from "../../core/model/base/action-result";
import {CarDto} from "../../core/model/dto/car/car.dto";
import {SetDisableActionInterceptor} from "../../core/decorator/disable-action-interceptor.decorator";
import {GetRows} from "../../core/model/base/get-rows";
import {CarEntity} from "../../entity/car/car.entity";
import {CategoryMenuDto} from "../../core/model/dto/category-menu/category-menu.dto";
import {JsonInputDto} from "../../core/model/dto/json-input/json-input.dto";
import {CityEntity} from "../../entity/city/city.entity";
import {PostEntity} from "../../entity/post/post.entity";

@Controller(CONTROLLER_CONST.CAR)
export class CarController {
    constructor(private readonly carService: CarService) {}

    @UseGuards(RoleGuard)
    @Role(EN_RoleEnum.ADMIN)
    @SetDisableActionInterceptor(true)
    @Post(REST_CONST.GLOBAL.SAVE)
    save (@Body() carDto: CarDto):Promise<ActionResult<CarEntity>> {
        return this.carService.save(carDto);
    }

    @UseGuards(RoleGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.UPDATE)
    update (@Body() carDto: CarDto):Promise<ActionResult<CarEntity>> {
        return this.carService.update(carDto);
    }

    @UseGuards(RoleGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.REMOVE)
    remove (@Body() id: number):Promise<ActionResult<CarEntity>> {
        return this.carService.remove(id);
    }

    @UseGuards(RoleGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.GET_ROWS)
    getRows(@Body() getList: GetRows<CarDto, CarEntity[]>): Promise<ActionResult<GetRows<CarDto, CarEntity[]>>> {
        return this.carService.getRowsCar(getList);
    }


    @Get(REST_CONST.GLOBAL.GET_LIST)
    async getList():Promise<ActionResult<CarEntity[]>>{
        return this.carService.getListCar();
    }

    @Get(':slug')
    getBySlug(@Param('slug')slug:string):Promise<ActionResult<CarEntity>>{
        return this.carService.getBySlug(slug)
    }
}
