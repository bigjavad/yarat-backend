import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {RoleGuard} from "../../core/guard/role.guard";
import {Role} from "../../core/decorator/role.decorator";
import {EN_RoleEnum} from "../../core/enum/form/EN_Role.enum";
import {REST_CONST} from "../../core/const/rest.const";
import {PropertyDto} from "../../core/model/dto/property/property.dto";
import {ActionResult} from "../../core/model/base/action-result";
import {JwtAuthGuard} from "../../jwt-auth.guard";
import {PropertyEntity} from "../../entity/property/property.entity";
import {GetRows} from "../../core/model/base/get-rows";
import {PropertyService} from "./property.service";
import {CONTROLLER_CONST} from "../../core/const/controller.const";

@Controller(CONTROLLER_CONST.PROPERTY)
export class PropertyController {

    constructor(private readonly propertyService: PropertyService) {
    }


    @UseGuards(RoleGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.SAVE)
    save(@Body() propertyDto: PropertyDto): Promise<ActionResult<PropertyEntity>> {
        return this.propertyService.saveProperty(propertyDto);
    }

    @UseGuards(JwtAuthGuard)
    @Post(REST_CONST.GLOBAL.UPDATE)
    update(@Body() propertyDto: PropertyDto): Promise<ActionResult<PropertyEntity>> {
        return this.propertyService.updateProperty(propertyDto);
    }

    @UseGuards(RoleGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.REMOVE)
    remove(@Body() id: number): Promise<ActionResult<PropertyEntity>> {
        return this.propertyService.remove(id);
    }

    @UseGuards(RoleGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.GET_ROWS)
    getRows(@Body() getList: GetRows<PropertyDto, PropertyEntity[]>): Promise<ActionResult<GetRows<PropertyDto, PropertyEntity[]>>> {
        return this.propertyService.getRowsProperty(getList);
    }


}
