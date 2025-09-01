import {Body, Controller, Post, UseGuards} from "@nestjs/common";
import {CONTROLLER_CONST} from "../../core/const/controller.const";
import {JwtAuthGuard} from "../../jwt-auth.guard";
import {Role} from "../../core/decorator/role.decorator";
import {EN_RoleEnum} from "../../core/enum/form/EN_Role.enum";
import {REST_CONST} from "../../core/const/rest.const";
import {ActionResult} from "../../core/model/base/action-result";
import {OrdersEntity} from "../../entity/orders/orders.entity";
import {RoleGuard} from "../../core/guard/role.guard";
import {GetRows} from "../../core/model/base/get-rows";
import {OrdersDto} from "../../core/model/dto/orders/orders.dto";
import {OrdersService} from "./orders.service";

@Controller(CONTROLLER_CONST.ORDERS)
export class OrdersController {

    constructor(private readonly  ordersService: OrdersService) {}

    @UseGuards(JwtAuthGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.SAVE)
    async save(@Body() ordersDto:OrdersDto):Promise<ActionResult<OrdersEntity>>{
        return this.ordersService.save(ordersDto);
    }

    @UseGuards(JwtAuthGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.UPDATE)
    update(@Body() ordersDto: OrdersDto): Promise<ActionResult<OrdersDto>> {
        return this.ordersService.updateOrders(ordersDto);
    }

    @UseGuards(RoleGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.REMOVE)
    remove(@Body() id: number): Promise<ActionResult<OrdersEntity>> {
        return this.ordersService.remove(id);
    }

    @UseGuards(RoleGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.GET_ROWS)
    getRows(@Body() getList: GetRows<OrdersDto, OrdersEntity[]>): Promise<ActionResult<GetRows<OrdersDto, OrdersEntity[]>>> {
        return this.ordersService.getRowsOrders(getList);
    }
}
