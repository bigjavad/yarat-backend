import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {RoleGuard} from "../../../core/guard/role.guard";
import {Role} from "../../../core/decorator/role.decorator";
import {EN_RoleEnum} from "../../../core/enum/form/EN_Role.enum";
import {REST_CONST} from "../../../core/const/rest.const";
import {ActionResult} from "../../../core/model/base/action-result";
import {JwtAuthGuard} from "../../../jwt-auth.guard";
import {GetRows} from "../../../core/model/base/get-rows";
import {PropertyValueService} from "./property-value.service";
import {PropertyValueDto} from "../../../core/model/dto/property/property-value.dto";
import {PropertyValueEntity} from "../../../entity/property/property-value.entity";
import {CONTROLLER_CONST} from "../../../core/const/controller.const";

@Controller(CONTROLLER_CONST.PROPERTY_VALUE)
export class PropertyValueController {

    constructor(private readonly propertyValueService: PropertyValueService) {}

    @UseGuards(RoleGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.SAVE)
    save(@Body() propertyValueDto: PropertyValueDto): Promise<ActionResult<PropertyValueEntity>> {
        return this.propertyValueService.savePropertyValue(propertyValueDto);
    }

    @UseGuards(JwtAuthGuard)
    @Post(REST_CONST.GLOBAL.UPDATE)
    update(@Body() propertyValueDto: PropertyValueDto): Promise<ActionResult<PropertyValueEntity>> {
        return this.propertyValueService.updatePropertyValue(propertyValueDto);
    }

    @UseGuards(RoleGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.REMOVE)
    remove(@Body() id: number): Promise<ActionResult<PropertyValueEntity>> {
        return this.propertyValueService.remove(id);
    }

    @UseGuards(RoleGuard)
    @Role(EN_RoleEnum.ADMIN)
    @Post(REST_CONST.GLOBAL.GET_ROWS)
    getRows(@Body() getList: GetRows<PropertyValueDto, PropertyValueEntity[]>): Promise<ActionResult<GetRows<PropertyValueDto, PropertyValueEntity[]>>> {
        return this.propertyValueService.getRowsPropertyValue(getList);
    }

    @Post(REST_CONST.PROPERTY_VALUE.GET_BY_PARENT_ID)
    getByParentId(@Body() propertyValueDto: PropertyValueDto): Promise<ActionResult<PropertyValueEntity[]>> {
        return this.propertyValueService.getByParentId(propertyValueDto);
    }

}
